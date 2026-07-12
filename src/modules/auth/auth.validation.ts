import { z } from 'zod';

export const loginZodSchema = z.object({
  email: z
    .string({ message: 'Email is required' }) 
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email format'),
    
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password is required'),
});