import {z} from "zod"

export const SearchQuerySchema = z.object({
  query: z.string().catch(""),
})

export const FromSchema = z.object({
  from: z.string().catch(""),
})

export const SearchPageSchema = FromSchema.merge(SearchQuerySchema)
