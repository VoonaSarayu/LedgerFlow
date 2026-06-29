import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';
import { InvoiceStatus } from '@prisma/client';

const router = Router();

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  amount: z.number().positive(),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
  dueDate: z.string().transform((str: string) => new Date(str)),
  customerId: z.string().uuid(),
});

const updateInvoiceSchema = invoiceSchema.partial();

// GET /api/invoices - List invoices
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;
    const { status, customerId, search } = req.query;

    const where: any = { companyId };

    if (status) {
      where.status = status as InvoiceStatus;
    }
    if (customerId) {
      where.customerId = customerId as string;
    }
    if (search) {
      where.invoiceNumber = {
        contains: search as string,
      };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(invoices);
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/stats - Overview stats
router.get('/stats', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;

    const invoices = await prisma.invoice.findMany({
      where: { companyId },
    });

    const totalRevenue = invoices
      .filter((inv: any) => inv.status === InvoiceStatus.PAID)
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const pendingRevenue = invoices
      .filter((inv: any) => inv.status === InvoiceStatus.SENT)
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const overdueRevenue = invoices
      .filter((inv: any) => inv.status === InvoiceStatus.OVERDUE)
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    const draftRevenue = invoices
      .filter((inv: any) => inv.status === InvoiceStatus.DRAFT)
      .reduce((sum: number, inv: any) => sum + inv.amount, 0);

    res.json({
      totalCount: invoices.length,
      paidCount: invoices.filter((i: any) => i.status === InvoiceStatus.PAID).length,
      sentCount: invoices.filter((i: any) => i.status === InvoiceStatus.SENT).length,
      overdueCount: invoices.filter((i: any) => i.status === InvoiceStatus.OVERDUE).length,
      draftCount: invoices.filter((i: any) => i.status === InvoiceStatus.DRAFT).length,
      revenue: {
        paid: totalRevenue,
        pending: pendingRevenue,
        overdue: overdueRevenue,
        draft: draftRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/:id - Single invoice
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id as string, companyId },
      include: {
        customer: true,
        payments: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices - Create invoice
router.post(
  '/',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = invoiceSchema.parse(req.body);

      // Check if invoice number is unique for the company
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          invoiceNumber: data.invoiceNumber,
          companyId,
        },
      });

      if (existingInvoice) {
        return res
          .status(400)
          .json({ error: `Invoice number ${data.invoiceNumber} already exists for your company.` });
      }

      const invoice = await prisma.invoice.create({
        data: {
          ...data,
          companyId,
        },
        include: {
          customer: true,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: 'INVOICE_CREATED',
          details: `Created invoice: ${invoice.invoiceNumber} of amount $${invoice.amount}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/invoices/:id - Update invoice
router.put(
  '/:id',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = updateInvoiceSchema.parse(req.body);

      const invoice = await prisma.invoice.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found.' });
      }

      const updatedInvoice = await prisma.invoice.update({
        where: { id: req.params.id as string },
        data,
        include: {
          customer: true,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: 'INVOICE_UPDATED',
          details: `Updated invoice ID: ${invoice.id}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json(updatedInvoice);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/invoices/:id - Delete invoice
router.delete(
  '/:id',
  requireAuth,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;

      const invoice = await prisma.invoice.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found.' });
      }

      await prisma.invoice.delete({
        where: { id: req.params.id as string },
      });

      await prisma.activityLog.create({
        data: {
          action: 'INVOICE_DELETED',
          details: `Deleted invoice number: ${invoice.invoiceNumber}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json({ message: 'Invoice successfully deleted.' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
