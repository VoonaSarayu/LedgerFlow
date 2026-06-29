import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

const updateCustomerSchema = customerSchema.partial();

// GET /api/customers - List customers
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;
    const { search } = req.query;

    const where: any = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id - Single customer
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;

    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id as string, companyId },
      include: {
        invoices: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// POST /api/customers - Create customer
router.post(
  '/',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = customerSchema.parse(req.body);

      // Check if email already registered for this company
      const existingCustomer = await prisma.customer.findUnique({
        where: {
          email_companyId: {
            email: data.email,
            companyId,
          },
        },
      });

      if (existingCustomer) {
        return res
          .status(400)
          .json({ error: `Customer with email ${data.email} already exists.` });
      }

      const customer = await prisma.customer.create({
        data: {
          ...data,
          companyId,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: 'CUSTOMER_CREATED',
          details: `Created customer: ${customer.name} (${customer.email})`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/customers/:id - Update customer
router.put(
  '/:id',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = updateCustomerSchema.parse(req.body);

      const customer = await prisma.customer.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }

      // Check if updating email to another customer's email
      if (data.email && data.email !== customer.email) {
        const emailConflict = await prisma.customer.findUnique({
          where: {
            email_companyId: {
              email: data.email,
              companyId,
            },
          },
        });
        if (emailConflict) {
          return res.status(400).json({ error: 'Customer email already in use.' });
        }
      }

      const updatedCustomer = await prisma.customer.update({
        where: { id: req.params.id as string },
        data,
      });

      await prisma.activityLog.create({
        data: {
          action: 'CUSTOMER_UPDATED',
          details: `Updated customer: ${updatedCustomer.name}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json(updatedCustomer);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/customers/:id - Delete customer
router.delete(
  '/:id',
  requireAuth,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;

      const customer = await prisma.customer.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found.' });
      }

      await prisma.customer.delete({
        where: { id: req.params.id as string },
      });

      await prisma.activityLog.create({
        data: {
          action: 'CUSTOMER_DELETED',
          details: `Deleted customer: ${customer.name}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json({ message: 'Customer successfully deleted.' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
