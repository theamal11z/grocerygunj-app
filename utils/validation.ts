import { z } from 'zod';
import { t } from '@/lib/i18n';

/**
 * Error with validation details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Parse data with a Zod schema and return typed result or validation errors
 */
export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    
    // Fallback for other error types
    return {
      success: false,
      errors: [{ field: 'unknown', message: t('errors.validation') }],
    };
  }
}

// Common validation schemas
export const emailSchema = z
  .string()
  .email(t('validation.invalidEmail'))
  .min(5, t('validation.tooShort'))
  .max(100, t('validation.tooLong'));

export const passwordSchema = z
  .string()
  .min(8, t('validation.passwordTooShort'))
  .max(100, t('validation.tooLong'))
  .regex(/[A-Z]/, t('validation.passwordNeedsUppercase'))
  .regex(/[a-z]/, t('validation.passwordNeedsLowercase'))
  .regex(/[0-9]/, t('validation.passwordNeedsNumber'));

export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, t('validation.invalidPhone'));

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, t('validation.required')),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2, t('validation.nameTooShort')),
  phone: phoneSchema.optional(),
});

// User profile schema
export const profileSchema = z.object({
  fullName: z.string().min(2, t('validation.nameTooShort')),
  phone: phoneSchema.optional(),
  email: emailSchema,
});

// Address schema
export const addressSchema = z.object({
  type: z.enum(['home', 'work', 'other']),
  address: z.string().min(5, t('validation.addressTooShort')),
  area: z.string().min(2, t('validation.areaTooShort')),
  city: z.string().min(2, t('validation.cityTooShort')),
  isDefault: z.boolean().optional(),
});

// Product schema for client-side validation
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  price: z.number().positive(),
  description: z.string(),
  image_urls: z.array(z.string().url()),
  category_id: z.string(),
  stock: z.number().int().nonnegative(),
  unit: z.string(),
  discount: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  review_count: z.number().int().nonnegative().optional(),
});
