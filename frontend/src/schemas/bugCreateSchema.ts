import {z} from "zod";

const bugCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  stepsToReproduce: z.string()
})
  

export default bugCreateSchema