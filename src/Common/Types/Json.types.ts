import { ZodSchema, z } from "zod";

// reccursive type cannot be inferred easily so we declare it ourselves an use it to type the lazy Json zod schema
export type Json = string | number | null | boolean | Json[] | { [key: string]: Json };

export const Json: z.Schema<Json> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(Json), z.record(Json)])
);
