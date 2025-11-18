import { z } from 'zod';

// Admin login validation schema
export const adminLoginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z.string()
        .min(1, 'Password is required'),
});
