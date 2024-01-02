import { CacheValueType } from "@/Cache/Cache.types";
import { SafeOutput } from "@/Common/Types/SafeOutput.type";
import { IZodCacheEntry } from "@/Zod/ZodCache/ZodCacheEntry/IZodCacheEntry";

/**
 * Instances of IZodCache will allow you to get/set cache entry from a IZodCacheEntry instance
 */
export interface IZodCache {
  get<const TData extends CacheValueType, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>
  ): Promise<TData | undefined>;
  set<const TData extends CacheValueType, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>,
    value: TData,
    ttl?: number
  ): Promise<void>;

  safeGet<const TData extends CacheValueType, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>
  ): Promise<SafeOutput<TData | undefined>>;
  safeSet<const TData extends CacheValueType, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>,
    value: TData,
    ttl?: number
  ): Promise<SafeOutput<void>>;
}
