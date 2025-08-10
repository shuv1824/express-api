import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import { ResponseUtil } from '@/utils/response';
import { validateSchema } from '@/utils/validation';

export const validateBody = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { isValid, errors, value } = validateSchema(schema, req.body);

    if (!isValid) {
      ResponseUtil.validationError(res, 'Validation failed', errors);
      return;
    }

    req.body = value; // Use validated and sanitized data
    next();
  };
};

export const validateParams = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { isValid, errors, value } = validateSchema(schema, req.params);

    if (!isValid) {
      ResponseUtil.validationError(res, 'Invalid parameters', errors);
      return;
    }

    next();
  };
};

export const validateQuery = (schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { isValid, errors, value } = validateSchema(schema, req.query);

    if (!isValid) {
      ResponseUtil.validationError(res, 'Invalid query parameters', errors);
      return;
    }

    next();
  };
};

// Combine multiple validation middlewares
export const validate = {
  body: validateBody,
  params: validateParams,
  query: validateQuery,
};
