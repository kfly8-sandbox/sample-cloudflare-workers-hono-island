import { z } from 'zod'
import { uuidv7 } from 'uuidv7';

export const userIdSchema = z.string().brand('UserId')
export type UserId = z.infer<typeof userIdSchema>
export const createUserId = (id: string = uuidv7()) => userIdSchema.parse(id)

