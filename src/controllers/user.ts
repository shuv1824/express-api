import { Request, Response } from 'express';
import { User } from '@/models/User';
import { AuthRequest, PaginationQuery } from '@/types';
import { ResponseUtil } from '@/utils/response';
import { logger } from '@/utils/logger';
import { asyncHandler } from '@/middleware/error';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, sort, search }: PaginationQuery = req.query;

  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '10', 10);
  const skip = (pageNum - 1) * limitNum;

  // Build query
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const [users, total] = await Promise.all([
    User.find(query)
      .sort(sort || '-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  return ResponseUtil.paginated(
    res,
    users,
    pageNum,
    limitNum,
    total,
    'Users retrieved successfully'
  );
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return ResponseUtil.notFound(res, 'User not found');
  }

  return ResponseUtil.success(
    res,
    user.toObject(),
    'User retrieved successfully'
  );
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return ResponseUtil.conflict(res, 'User with this email already exists');
  }

  // Create new user
  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'user',
  });

  await user.save();

  logger.info('User created by admin', {
    createdUserId: user._id,
    email: user.email,
  });

  return ResponseUtil.success(
    res,
    user.toObject(),
    'User created successfully',
    201
  );
});

export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    // Prevent users from modifying their own role or status (except admins)
    if (id === req.user?.id && req.user?.role !== 'admin') {
      if (role !== undefined && role !== user.role) {
        return ResponseUtil.forbidden(res, 'Cannot modify your own role');
      }
      if (isActive !== undefined && isActive !== user.isActive) {
        return ResponseUtil.forbidden(res, 'Cannot modify your own status');
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return ResponseUtil.conflict(res, 'Email is already taken');
      }
      user.email = email.toLowerCase();
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    logger.info('User updated', {
      updatedUserId: user._id,
      updatedBy: req.user?.id,
    });

    return ResponseUtil.success(
      res,
      user.toObject(),
      'User updated successfully'
    );
  }
);

export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Prevent users from deleting themselves
    if (id === req.user?.id) {
      return ResponseUtil.forbidden(res, 'Cannot delete your own account');
    }

    const user = await User.findById(id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    await User.findByIdAndDelete(id);

    logger.info('User deleted', {
      deletedUserId: id,
      deletedBy: req.user?.id,
    });

    return ResponseUtil.success(res, null, 'User deleted successfully');
  }
);

export const deactivateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Prevent users from deactivating themselves
    if (id === req.user?.id) {
      return ResponseUtil.forbidden(res, 'Cannot deactivate your own account');
    }

    const user = await User.findById(id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    user.isActive = false;
    await user.save();

    logger.info('User deactivated', {
      deactivatedUserId: id,
      deactivatedBy: req.user?.id,
    });

    return ResponseUtil.success(
      res,
      user.toObject(),
      'User deactivated successfully'
    );
  }
);

export const activateUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    user.isActive = true;
    await user.save();

    logger.info('User activated', {
      activatedUserId: id,
      activatedBy: req.user?.id,
    });

    return ResponseUtil.success(
      res,
      user.toObject(),
      'User activated successfully'
    );
  }
);

export const getUserStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'user' }),
    ]);

    const [total, active, inactive, admin, user] = stats;

    return ResponseUtil.success(
      res,
      {
        total,
        active,
        inactive,
        admin,
        user,
        recentUsers: await User.find().sort({ createdAt: -1 }).limit(5).lean(),
      },
      'User statistics retrieved successfully'
    );
  }
);
