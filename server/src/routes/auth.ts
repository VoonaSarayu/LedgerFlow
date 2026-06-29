import { Router, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ledgerflow-super-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'ledgerflow-refresh-secret-key-change-in-prod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Seed default roles if they don't exist
async function getOrCreateRole(name: string, permissions: any) {
  let role = await prisma.role.findUnique({ where: { name } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        name,
        permissions,
      },
    });
  }
  return role;
}

// Token helper function
async function generateAndSetTokens(user: any, res: Response) {
  // 1. Generate access token (expires in 15 minutes)
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      roleName: user.role.name,
      companyId: user.companyId,
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  // 2. Generate refresh token (expires in 7 days)
  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      jti: Math.random().toString(36).substring(2) + Date.now().toString(36),
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // 3. Save refresh token to database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // 4. Set refresh token in secure httpOnly cookie
  res.cookie('lf_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // 1. Create company
    const company = await prisma.company.create({
      data: {
        name: data.companyName,
      },
    });

    // 2. Ensure default roles exist in DB
    const adminRole = await getOrCreateRole('ADMIN', {
      all: true,
      invoices: ['create', 'read', 'update', 'delete'],
      customers: ['create', 'read', 'update', 'delete'],
      subscriptions: ['create', 'read', 'update', 'delete'],
      payments: ['create', 'read', 'update', 'delete'],
    });

    await getOrCreateRole('BILLING_MANAGER', {
      invoices: ['create', 'read', 'update'],
      customers: ['create', 'read', 'update'],
      subscriptions: ['read'],
      payments: ['create', 'read'],
    });

    await getOrCreateRole('VIEWER', {
      invoices: ['read'],
      customers: ['read'],
      subscriptions: ['read'],
      payments: ['read'],
    });

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4. Create User (defaults to ADMIN since they created the company)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        companyId: company.id,
        roleId: adminRole.id,
      },
      include: {
        role: true,
        company: true,
      },
    });

    // 5. Create default Subscription for company
    await prisma.subscription.create({
      data: {
        companyId: company.id,
        planName: 'Free',
        price: 0,
        interval: 'MONTHLY',
        status: 'ACTIVE',
      },
    });

    // 6. Log activity
    await prisma.activityLog.create({
      data: {
        action: 'USER_REGISTERED',
        details: `User registered and created company: ${company.name}`,
        userId: user.id,
        companyId: company.id,
      },
    });

    // 7. Generate and Set Tokens
    const accessToken = await generateAndSetTokens(user, res);

    res.status(201).json({
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        company: {
          id: company.id,
          name: company.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        role: true,
        company: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'USER_LOGIN',
        details: 'User logged in successfully',
        userId: user.id,
        companyId: user.companyId,
      },
    });

    const accessToken = await generateAndSetTokens(user, res);

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.lf_refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found.' });
    }

    // 1. Verify token in DB
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            role: true,
            company: true,
          },
        },
      },
    });

    if (!dbToken || dbToken.expiresAt < new Date()) {
      // Invalidate cookie and DB record if expired
      if (dbToken) {
        await prisma.refreshToken.delete({ where: { id: dbToken.id } });
      }
      res.clearCookie('lf_refresh_token');
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    // 2. JWT-Verify refresh token
    try {
      jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      await prisma.refreshToken.delete({ where: { id: dbToken.id } });
      res.clearCookie('lf_refresh_token');
      return res.status(401).json({ error: 'Session signature corrupted. Please log in again.' });
    }

    // 3. Revoke old refresh token from DB
    await prisma.refreshToken.delete({ where: { id: dbToken.id } });

    // 4. Generate new pair of tokens (Token Rotation)
    const newAccessToken = await generateAndSetTokens(dbToken.user, res);

    res.json({
      token: newAccessToken,
      user: {
        id: dbToken.user.id,
        email: dbToken.user.email,
        firstName: dbToken.user.firstName,
        lastName: dbToken.user.lastName,
        role: dbToken.user.role.name,
        company: {
          id: dbToken.user.company.id,
          name: dbToken.user.company.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.lf_refresh_token;
    if (refreshToken) {
      // Revoke from database
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Clear cookie
    res.clearCookie('lf_refresh_token');
    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/profile
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: true,
        company: {
          include: {
            subscriptions: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
      company: {
        id: user.company.id,
        name: user.company.name,
        subscriptions: user.company.subscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/role - Update active user's role in DB
router.put('/role', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { roleName } = req.body;
    if (!roleName) return res.status(400).json({ error: 'roleName is required' });

    const role = await prisma.role.findUnique({
      where: { name: roleName.toUpperCase() },
    });

    if (!role) {
      return res.status(400).json({ error: `Role ${roleName} does not exist.` });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { roleId: role.id },
      include: { role: true },
    });

    // Sign a new token
    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        roleName: updatedUser.role.name,
        companyId: updatedUser.companyId,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create log
    await prisma.activityLog.create({
      data: {
        action: 'ROLE_MODIFIED',
        details: `Simulated role change to: ${role.name}`,
        userId: updatedUser.id,
        companyId: updatedUser.companyId,
      },
    });

    res.json({
      message: 'Role updated successfully',
      token,
      role: updatedUser.role.name,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
