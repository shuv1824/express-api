import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export interface IUser {
  // _id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

export interface DatabaseError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
