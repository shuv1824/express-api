export interface IUser {
  // _id: tring;
  email: string;
  password: string;
  name: string;
  // role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  id: string;
  email: string;
  // role: 'user' | 'admin';
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
