import { z } from 'zod';

export const SigninFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password length must not be empty' }),
});
