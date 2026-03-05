import {z} from 'zod';

const logHourSchema = z.object({
  time: z.number().positive('Number must be a positive number')
})

export default logHourSchema;