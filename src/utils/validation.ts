import { ValidationError } from '@/types';
import { z } from 'zod';

// Generic validation function
export const validateSchema = (schema: z.ZodObject<any, any>, data: any) => {
  try {
    const value = schema.parse(data);
    return {
      isValid: true,
      value,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.issues.map(
        (issue: any) => ({
          field: issue.path[0],
          message: issue.message,
        })
      );

      return {
        isValid: false,
        errors: validationErrors,
      };
    } else {
      return {
        isValid: false,
        errors: [],
      };
    }
  }
};
