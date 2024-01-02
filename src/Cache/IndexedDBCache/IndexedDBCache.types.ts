import { z } from "zod";
import { CacheValueType } from "@/Cache/Cache.types";
import { createTypeChecker } from "@/Zod/ZodUtils/createTypeChecker";

/**
 * The schema representation of a record in our IndexedDBCache.
 * Using zod here is not mandatory. But as I need to typecheck at runtime the retrieved data, I am using it for convenience.
 */
export const IndexedDBRecordType = z.object({
  key: z.string(),
  value: CacheValueType,
  expiry: z.number().optional(),
});
/** linked type */
export type IndexedDBRecordType = z.infer<typeof IndexedDBRecordType>;
/** linked typechecker */
export const isIndexedDBRecordType = createTypeChecker(IndexedDBRecordType);
