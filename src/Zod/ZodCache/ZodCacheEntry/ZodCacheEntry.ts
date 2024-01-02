import { z } from "zod";
import { CacheValueType } from "@/Cache/Cache.types";
import { IZodCacheEntry } from "@/Zod/ZodCache/ZodCacheEntry/IZodCacheEntry";

/**
 * This represent a cache entry and make a static link between it's key and schema for runtime and buildtime type checking.
 */
export default class ZodCacheEntry<const TData extends CacheValueType, const Key extends string>
  implements IZodCacheEntry<TData, Key>
{
  constructor(
    private readonly key: Key,
    private readonly schema: z.Schema<TData>
  ) {}

  getKey(): Key {
    return this.key;
  }
  getSchema(): z.Schema<TData> {
    return this.schema;
  }
}
