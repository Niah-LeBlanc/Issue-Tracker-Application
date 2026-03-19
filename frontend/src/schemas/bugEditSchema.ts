import { z } from 'zod';

// All fields optional for PATCH — at least one must be present
const bugEditSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  stepsToReproduce: z.string().min(1).optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field is required' });

export default bugEditSchema;
