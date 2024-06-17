import {z} from "zod"

export const SearchQuerySchema = z.object({
  query: z.string().catch(""),
})