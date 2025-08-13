import { Router } from 'express';
import * as userController from '@/controllers/user';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { registerSchema, updateUserSchema } from '@/schemas/auth';
import { paginationSchema, mongoIdSchema } from '@/schemas/global';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/stats', authorize('admin'), userController.getUserStats);

// Admin-only routes
router.get(
  '/',
  authorize('admin'),
  validate.query(paginationSchema),
  userController.getAllUsers
);

router.get(
  '/:id',
  authorize('admin'),
  validate.params(mongoIdSchema),
  userController.getUserById
);

router.post(
  '/',
  authorize('admin'),
  validate.body(registerSchema),
  userController.createUser
);

router.put(
  '/:id',
  authorize('admin'),
  validate.params(mongoIdSchema),
  validate.body(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authorize('admin'),
  validate.params(mongoIdSchema),
  userController.deleteUser
);

router.patch(
  '/:id/deactivate',
  authorize('admin'),
  validate.params(mongoIdSchema),
  userController.deactivateUser
);

router.patch(
  '/:id/activate',
  authorize('admin'),
  validate.params(mongoIdSchema),
  userController.activateUser
);

export default router;
