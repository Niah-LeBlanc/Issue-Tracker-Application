import {z} from 'zod';

const commentSchema = z.object({
  text: z.string().min(1, "Must have text!"),
})

export default commentSchema;