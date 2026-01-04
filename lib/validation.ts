/**
 * Validation Utilities - Inventory HQ Frontend
 *
 * Client-side validation helpers using Zod schemas.
 * Provides form validation and error formatting.
 */

import { z, ZodError, ZodSchema } from 'zod';

/**
 * Validation error format for forms
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Validate data against a Zod schema
 */
export const validate = <T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> => {
  try {
    const validated = schema.parse(data);
    return {
      success: true,
      data: validated,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: formatZodErrors(error),
      };
    }

    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    };
  }
};

/**
 * Format Zod errors into a user-friendly format
 */
export const formatZodErrors = (error: ZodError): ValidationError[] => {
  return error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
};

/**
 * Get error message for a specific field
 */
export const getFieldError = (
  errors: ValidationError[] | undefined,
  fieldName: string
): string | undefined => {
  if (!errors) {
    return undefined;
  }

  const error = errors.find((err) => err.field === fieldName);
  return error?.message;
};

/**
 * Check if a field has an error
 */
export const hasFieldError = (
  errors: ValidationError[] | undefined,
  fieldName: string
): boolean => {
  return getFieldError(errors, fieldName) !== undefined;
};

/**
 * Common validation schemas for forms
 */

// Email validation
export const emailSchema = z.string().email('Please enter a valid email address');

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters');

// Password validation (for Cognito)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Quantity validation
export const quantitySchema = z
  .number()
  .nonnegative('Quantity cannot be negative')
  .or(z.string().regex(/^\d+$/).transform(Number));

// Optional text field
export const optionalTextSchema = z.string().max(500, 'Text is too long').optional();

/**
 * Form validation schemas
 */

// Create family form
export const createFamilyFormSchema = z.object({
  name: nameSchema,
});

// Add member form
export const addMemberFormSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  role: z.enum(['admin', 'suggester'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
});

// Create inventory item form
export const createInventoryItemFormSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(200, 'Name is too long'),
  quantity: quantitySchema,
  unit: z.string().max(50).optional(),
  locationId: z.string().uuid().optional(),
  preferredStoreId: z.string().uuid().optional(),
  lowStockThreshold: quantitySchema,
  notes: optionalTextSchema,
});

// Update inventory item form
export const updateInventoryItemFormSchema = createInventoryItemFormSchema.partial();

// Adjust quantity form
export const adjustQuantityFormSchema = z.object({
  adjustment: z.number().int('Adjustment must be a whole number'),
});

// Create storage location form
export const createStorageLocationFormSchema = z.object({
  name: nameSchema,
  description: optionalTextSchema,
});

// Create store form
export const createStoreFormSchema = z.object({
  name: nameSchema,
  address: z.string().max(500).optional(),
  notes: optionalTextSchema,
});

// Add to shopping list form
export const addToShoppingListFormSchema = z.object({
  inventoryItemId: z.string().uuid().optional(),
  itemName: z.string().min(1, 'Item name is required').max(200),
  quantity: quantitySchema,
  unit: z.string().max(50).optional(),
  storeId: z.string().uuid().optional(),
  notes: optionalTextSchema,
});

// Create suggestion form
export const createSuggestionFormSchema = z.object({
  type: z.enum(['add_item', 'add_to_shopping_list', 'other']),
  itemName: z.string().min(1, 'Item name is required').max(200),
  quantity: quantitySchema.optional(),
  unit: z.string().max(50).optional(),
  locationId: z.string().uuid().optional(),
  storeId: z.string().uuid().optional(),
  notes: optionalTextSchema,
});

// Login form
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Register form
export const registerFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    name: nameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type inference helpers
 */
export type CreateFamilyFormData = z.infer<typeof createFamilyFormSchema>;
export type AddMemberFormData = z.infer<typeof addMemberFormSchema>;
export type CreateInventoryItemFormData = z.infer<typeof createInventoryItemFormSchema>;
export type UpdateInventoryItemFormData = z.infer<typeof updateInventoryItemFormSchema>;
export type AdjustQuantityFormData = z.infer<typeof adjustQuantityFormSchema>;
export type CreateStorageLocationFormData = z.infer<typeof createStorageLocationFormSchema>;
export type CreateStoreFormData = z.infer<typeof createStoreFormSchema>;
export type AddToShoppingListFormData = z.infer<typeof addToShoppingListFormSchema>;
export type CreateSuggestionFormData = z.infer<typeof createSuggestionFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
