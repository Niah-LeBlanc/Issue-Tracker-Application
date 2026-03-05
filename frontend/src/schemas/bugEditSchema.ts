import {z} from "zod";

const bugEditSchema = z.object({
  title: z.string(),
  description: z.string(),
  stepsToReproduce: z.string()
})
  

export default bugEditSchema