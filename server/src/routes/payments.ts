import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';
import { PaymentStatus, InvoiceStatus } from '@prisma/client';

const router = Router();

const paymentSchema = z.object({
  amount: z.number().positive(),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  provider: z.string().min(1),
  transactionId: z.string().optional(),
  invoiceId: z.string().uuid(),
});

const updatePaymentSchema = paymentSchema.partial();

// GET /api/payments - List payments
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;
    const { status, invoiceId } = req.query;

    const where: any = { companyId };

    if (status) {
      where.status = status as PaymentStatus;
    }
    if (invoiceId) {
      where.invoiceId = invoiceId as string;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(payments);
  } catch (error) {
    next(error);
  }
});

// POST /api/payments - Create payment record
router.post(
  '/',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = paymentSchema.parse(req.body);

      // Verify invoice exists and belongs to the company
      const invoice = await prisma.invoice.findFirst({
        where: { id: data.invoiceId, companyId },
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found or belongs to another company.' });
      }

      // Record payment inside a transaction
      const payment = await prisma.$transaction(async (tx) => {
        const createdPayment = await (tx as any).payment.create({
          data: {
            ...data,
            companyId,
          },
        });

        // If payment status is SUCCESS, update Invoice status to PAID
        if (data.status === PaymentStatus.SUCCESS) {
          await (tx as any).invoice.update({
            where: { id: data.invoiceId },
            data: { status: InvoiceStatus.PAID },
          });
        } else if (data.status === PaymentStatus.FAILED) {
          // Keep invoice status as OVERDUE/SENT but register failed try
          await (tx as any).invoice.update({
            where: { id: data.invoiceId },
            data: { status: InvoiceStatus.OVERDUE },
          });
        }

        return createdPayment;
      });

      await prisma.activityLog.create({
        data: {
          action: 'PAYMENT_RECORDED',
          details: `Recorded payment of $${payment.amount} (Status: ${payment.status}) against invoice ID: ${payment.invoiceId}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/payments/:id - Update payment record status
router.put(
  '/:id',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = updatePaymentSchema.parse(req.body);

      const payment = await prisma.payment.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found.' });
      }

      const updatedPayment = await prisma.$transaction(async (tx) => {
        const updated = await (tx as any).payment.update({
          where: { id: req.params.id as string },
          data,
        });

        // Sync invoice status if updating status to SUCCESS
        if (data.status === PaymentStatus.SUCCESS && payment.status !== PaymentStatus.SUCCESS) {
          await (tx as any).invoice.update({
            where: { id: updated.invoiceId },
            data: { status: InvoiceStatus.PAID },
          });
        }

        return updated;
      });

      await prisma.activityLog.create({
        data: {
          action: 'PAYMENT_UPDATED',
          details: `Updated payment status to ${updatedPayment.status} for payment ID: ${updatedPayment.id}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json(updatedPayment);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/payments/:id - Delete payment log (Admin only)
router.delete(
  '/:id',
  requireAuth,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;

      const payment = await prisma.payment.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found.' });
      }

      await prisma.payment.delete({
        where: { id: req.params.id as string },
      });

      await prisma.activityLog.create({
        data: {
          action: 'PAYMENT_DELETED',
          details: `Deleted payment record of $${payment.amount} (ID: ${payment.id})`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json({ message: 'Payment record successfully deleted.' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
