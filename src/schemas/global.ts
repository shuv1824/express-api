import z from 'zod';

// Query validation schemas
export const paginationSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  sort: z.string().optional().default('-createdAt'),
  search: z.string().optional().nullable(),
});

// MongoDB ObjectId validation
export const mongoIdSchema = z.object({
  id: z.string().length(24),
});
