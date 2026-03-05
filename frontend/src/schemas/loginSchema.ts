import {z} from 'zod';

const loginSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export default loginSchema;