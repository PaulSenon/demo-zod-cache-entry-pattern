import { z } from "zod";
import { CacheValueType } from "@/Cache/Cache.types";

/**
 * This represent a cache entry and make a static link between it's key and schema for runtime and buildtime type checking.
 */
export interface IZodCacheEntry<TData extends CacheValueType, Key extends string> {
  getKey(): Key;
  getSchema(): z.Schema<TData>;
}
