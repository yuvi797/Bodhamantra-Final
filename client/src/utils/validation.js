import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z.string()
        .min(1, 'Password is required'),
});

// Student registration validation schema
export const studentRegisterSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    branch: z.string()
        .min(2, 'Branch is required'),
    course: z.string()
        .min(2, 'Course is required'),
});

// Mentor registration validation schema
export const mentorRegisterSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    bio: z.string()
        .min(10, 'Bio must be at least 10 characters')
        .max(500, 'Bio must be less than 500 characters'),
    expertise: z.string()
        .min(1, 'At least one expertise is required'),
    availableHours: z.string()
        .min(1, 'Available hours per day is required')
        .regex(/^[0-9]+$/, 'Must be a valid number'),
});
