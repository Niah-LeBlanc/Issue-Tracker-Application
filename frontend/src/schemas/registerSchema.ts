import {z} from 'zod';

export const UserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.array(z.enum(['developer', 'business analyst', 'quality analyst', 'product manager', 'technical manager'])).min(1, 'Please select at least one role'),
});

export default UserSchema