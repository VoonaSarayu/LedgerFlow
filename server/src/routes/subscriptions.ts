import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest, requireAuth, requireRole } from '../middleware/auth';
import { SubscriptionStatus, InvoiceStatus, PaymentStatus } from '@prisma/client';

const router = Router();

const subscriptionSchema = z.object({
  planName: z.string().min(1),
  price: z.number().nonnegative(),
  interval: z.enum(['MONTHLY', 'YEARLY']),
  status: z.nativeEnum(SubscriptionStatus).default(SubscriptionStatus.ACTIVE),
  endDate: z.string().optional().transform((str: any) => (str ? new Date(str) : null)),
});

const upgradeSchema = z.object({
  planName: z.enum(['Startup', 'Growth', 'Enterprise']),
  interval: z.enum(['MONTHLY', 'YEARLY']),
});

const updateSubscriptionSchema = subscriptionSchema.partial();

// GET /api/subscriptions - List subscriptions
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = req.user!.companyId;

    const subscriptions = await prisma.subscription.findMany({
      where: { companyId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
});

// PUT /api/subscriptions/upgrade - Upgrade plan
router.put(
  '/upgrade',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = upgradeSchema.parse(req.body);

      // Determine pricing based on plan and interval
      let price = 0;
      if (data.planName === 'Startup') {
        price = data.interval === 'YEARLY' ? 23 : 29;
      } else if (data.planName === 'Growth') {
        price = data.interval === 'YEARLY' ? 79 : 99;
      } else if (data.planName === 'Enterprise') {
        price = 999; // Standard custom enterprise mock rate
      }

      // 1. Cancel previous active subscriptions
      await prisma.subscription.updateMany({
        where: {
          companyId,
          status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
        },
        data: {
          status: SubscriptionStatus.CANCELED,
          endDate: new Date(),
        },
      });

      // 2. Create new subscription
      const subscription = await prisma.subscription.create({
        data: {
          planName: data.planName,
          price,
          interval: data.interval,
          status: SubscriptionStatus.ACTIVE,
          companyId,
        },
      });

      // 3. Log activity
      await prisma.activityLog.create({
        data: {
          action: 'SUBSCRIPTION_UPGRADED',
          details: `Upgraded subscription to ${data.planName} ($${price}/${data.interval})`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json(subscription);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/subscriptions/simulate-billing-cycle - Automated Billing Simulator
router.post(
  '/simulate-billing-cycle',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;

      // 1. Get active subscription
      const activeSub = await prisma.subscription.findFirst({
        where: {
          companyId,
          status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
        },
      });

      if (!activeSub) {
        return res.status(400).json({ error: 'No active subscription found to run billing cycle.' });
      }

      // 2. Find or create a simulated customer
      let customer = await prisma.customer.findFirst({
        where: { companyId, status: 'ACTIVE' },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: 'Simulated Sandbox Customer Ltd',
            email: 'sandbox-corporate@example.com',
            status: 'ACTIVE',
            companyId,
          },
        });

        await prisma.activityLog.create({
          data: {
            action: 'CUSTOMER_CREATED',
            details: `Auto-generated customer for simulation: ${customer.name}`,
            userId: req.user!.id,
            companyId,
          },
        });
      }

      // 3. Billing calculation
      const baseFee = activeSub.price;
      // Add random mock API usage charge if they are on Pro/Growth plan
      const usageFee = activeSub.planName === 'Growth' ? Math.floor(Math.random() * 50) + 15 : 0;
      const totalAmount = baseFee + usageFee;

      const invoiceNumber = `LF-INV-${Math.floor(100000 + Math.random() * 900000)}`;

      // 4. Determine simulated payment result (85% success, 15% fail)
      const isSuccess = Math.random() > 0.15;
      const simulatedPaymentStatus = isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

      // 5. Database transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create Invoice
        const invoice = await (tx as any).invoice.create({
          data: {
            invoiceNumber,
            amount: totalAmount,
            status: isSuccess ? InvoiceStatus.PAID : InvoiceStatus.OVERDUE,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days out
            customerId: customer.id,
            companyId,
          },
          include: { customer: true },
        });

        // Create Payment Log
        const payment = await (tx as any).payment.create({
          data: {
            amount: totalAmount,
            status: simulatedPaymentStatus,
            provider: 'stripe',
            transactionId: isSuccess ? `ch_test_${Math.random().toString(36).substring(7).toUpperCase()}` : null,
            invoiceId: invoice.id,
            companyId,
          },
        });

        return { invoice, payment };
      });

      // 6. Log activities
      await prisma.activityLog.create({
        data: {
          action: 'INVOICE_GENERATED',
          details: `Simulated invoice generation: ${invoiceNumber} of amount $${totalAmount}`,
          userId: req.user!.id,
          companyId,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: 'PAYMENT_RECORDED',
          details: `Simulated gateway process. Result: ${simulatedPaymentStatus} (Amount: $${totalAmount})`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json({
        message: 'Billing cycle simulation completed.',
        invoice: result.invoice,
        payment: result.payment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/subscriptions - Create subscription
router.post(
  '/',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = subscriptionSchema.parse(req.body);

      // Create subscription
      const subscription = await prisma.subscription.create({
        data: {
          ...data,
          companyId,
        },
      });

      await prisma.activityLog.create({
        data: {
          action: 'SUBSCRIPTION_CREATED',
          details: `Provisioned subscription: ${subscription.planName} ($${subscription.price}/${subscription.interval})`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/subscriptions/:id - Update subscription
router.put(
  '/:id',
  requireAuth,
  requireRole(['ADMIN', 'BILLING_MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;
      const data = updateSubscriptionSchema.parse(req.body);

      const subscription = await prisma.subscription.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found.' });
      }

      const updatedSubscription = await prisma.subscription.update({
        where: { id: req.params.id as string },
        data,
      });

      await prisma.activityLog.create({
        data: {
          action: 'SUBSCRIPTION_UPDATED',
          details: `Updated subscription: ${updatedSubscription.planName} status to ${updatedSubscription.status}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json(updatedSubscription);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/subscriptions/:id - Delete/Cancel subscription
router.delete(
  '/:id',
  requireAuth,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user!.companyId;

      const subscription = await prisma.subscription.findFirst({
        where: { id: req.params.id as string, companyId },
      });

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found.' });
      }

      // Instead of deleting from DB, we mark subscription as CANCELED
      const updatedSubscription = await prisma.subscription.update({
        where: { id: req.params.id as string },
        data: {
          status: SubscriptionStatus.CANCELED,
          endDate: new Date(),
        },
      });

      await prisma.activityLog.create({
        data: {
          action: 'SUBSCRIPTION_CANCELED',
          details: `Canceled subscription: ${subscription.planName}`,
          userId: req.user!.id,
          companyId,
        },
      });

      res.json(updatedSubscription);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
