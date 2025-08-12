import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { AuthRequest, LoginCredentials, RegisterData } from '@/types';
import { ResponseUtil } from '@/utils/response';
import { logger } from '@/utils/logger';
import { config } from '@/config';
import { asyncHandler } from '@/middleware/error';

const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password }: RegisterData = req.body;

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
  });

  await user.save();

  // Generate JWT token
  const token = generateToken({
    id: user._id,
    email: user.email,
  });

  logger.info('User registered successfully', {
    userId: user._id,
    email: user.email,
  });

  return ResponseUtil.success(
    res,
    {
      user: user.toObject(),
      token,
    },
    'User registered successfully',
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginCredentials = req.body;

  // Find user and include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );
  if (!user) {
    return ResponseUtil.unauthorized(res, 'Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    return ResponseUtil.forbidden(res, 'Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return ResponseUtil.unauthorized(res, 'Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({
    id: user._id,
    email: user.email,
  });

  // Update last login (you might want to add this field to the user model)
  user.set('lastLoginAt', new Date());
  await user.save();

  logger.info('User logged in successfully', {
    userId: user._id,
    email: user.email,
  });

  return ResponseUtil.success(
    res,
    {
      user: user.toObject(),
      token,
    },
    'Login successful'
  );
});

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    return ResponseUtil.success(
      res,
      user.toObject(),
      'Profile retrieved successfully'
    );
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, email } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return ResponseUtil.conflict(res, 'Email is already taken');
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;

    await user.save();

    logger.info('User profile updated', {
      userId: user._id,
      email: user.email,
    });

    return ResponseUtil.success(
      res,
      user.toObject(),
      'Profile updated successfully'
    );
  }
);

// export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const { currentPassword, newPassword } = req.body;
//
//   const user = await User.findById(req.user?.id).select('+password');
//   if (!user) {
//     return ResponseUtil.notFound(res, 'User not found');
//   }
//
//   // Verify current password
//   const isCurrentPasswordValid = await user.comparePassword(currentPassword);
//   if (!isCurrentPasswordValid) {
//     return ResponseUtil.unauthorized(res, 'Current password is incorrect');
//   }
//
//   // Update password
//   user.password = newPassword;
//   await user.save();
//
//   logger.info('User password changed', {
//     userId: user._id,
//     email: user.email,
//   });
//
//   return ResponseUtil.success(res, null, 'Password changed successfully');
// });

export const refreshToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?.id);
    if (!user || !user.isActive) {
      return ResponseUtil.unauthorized(res, 'User not found or inactive');
    }

    // Generate new token
    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    return ResponseUtil.success(res, { token }, 'Token refreshed successfully');
  }
);

// export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
//   // In a stateless JWT setup, logout is handled client-side by removing the token
//   // If you want to implement token blacklisting, you would add the token to a blacklist here
//
//   logger.info('User logged out', {
//     userId: req.user?.id,
//     email: req.user?.email,
//   });
//
//   ResponseUtil.success(res, null, 'Logged out successfully');
// });
