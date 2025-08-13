import { Router, Request, Response } from 'express';
import { ResponseUtil } from '@/utils/response';
import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  ResponseUtil.success(
    res,
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    },
    'API is healthy'
  );
});

// API Info endpoint
router.get('/', (_req: Request, res: Response) => {
  ResponseUtil.success(
    res,
    {
      name: 'TypeScript Express API',
      version: '1.0.0',
      description:
        'Modern TypeScript Express API with authentication, MongoDB, and comprehensive features',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        health: '/api/health',
      },
    },
    'API information'
  );
});

// Route handlers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
