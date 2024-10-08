import {z} from "zod"

export const SearchQuerySchema = z.object({
  query: z.string().catch(""),
  random: z.boolean().catch(false),
})

export const FromSchema = z.object({
  from: z.string().catch(""),
})
