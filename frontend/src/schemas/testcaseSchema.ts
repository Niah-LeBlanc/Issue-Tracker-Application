import {z} from 'zod';

const testcaseSchema = z.object({
  title: z.string().min(2, "Must add Title!"),
  status: z.enum(["passed", "failed"]),
  description: z.string().min(2, "Must include Description"),
})

export default testcaseSchema;