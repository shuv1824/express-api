import { Router } from 'express';
import * as authController from '@/controllers/auth';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { authRateLimit } from '@/middleware/security';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  // changePasswordSchema,
} from '@/schemas/auth';

const router = Router();

// Apply rate limiting to all auth routes
router.use(authRateLimit);

// Public routes
router.post(
  '/register',
  validate.body(registerSchema),
  authController.register
);

router.post('/login', validate.body(loginSchema), authController.login);

// Protected routes
router.use(authenticate);

router.get('/profile', authController.getProfile);

router.put(
  '/profile',
  validate.body(updateUserSchema),
  authController.updateProfile
);

// router.post(
//   '/change-password',
//   validate.body(changePasswordSchema),
//   authController.changePassword
// );

router.post('/refresh-token', authController.refreshToken);

// router.post('/logout', authController.logout);

export default router;
