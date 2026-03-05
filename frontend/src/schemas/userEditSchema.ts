import {z} from "zod";

const userEditSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, "Full Name Is required"),
  role: z.array(z.enum(['developer', 'business analyst', 'quality analyst', 'product manager', 'technical manager', 'admin'])).optional()
})

export default userEditSchema