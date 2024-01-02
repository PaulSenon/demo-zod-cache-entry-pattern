import ICache from "@/Cache/ICache";
import { IZodCache } from "./IZodCache";
import { CacheValueType } from "@/Cache/Cache.types";
import { IZodCacheEntry } from "./ZodCacheEntry/IZodCacheEntry";
import { Json } from "@/Common/Types/Json.types";
import { SafeOutput, createErrorOutput, createSuccessOutput } from "@/Common/Types/SafeOutput.type";

/**
 * This class fed with an ICache instance will give you access to strongly typed get/set API over it.
 * The typing is leveraged by IZodCacheEntry instances
 */
export default class ZodCache implements IZodCache {
  constructor(private readonly cache: ICache) {}

  async get<const TData extends CacheValueType, const Key extends string>(entry: IZodCacheEntry<TData, Key>) {
    const value = await this.cache.get(entry.getKey());
    if (typeof value === "undefined") return undefined;

    // validate data
    const parseResult = await entry.getSchema().parseAsync(value);

    return parseResult;
  }

  async set<const TData extends CacheValueType, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>,
    value: TData,
    ttl?: number
  ) {
    // validate data
    const parseResult = await entry.getSchema().parseAsync(value);

    await this.cache.set(entry.getKey(), parseResult, ttl);
  }

  async safeGet<const TData extends Json, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>
  ): Promise<SafeOutput<TData | undefined>> {
    try {
      const value = await this.get(entry);
      return createSuccessOutput(value);
    } catch (e) {
      const error = e instanceof Error ? e : new Error("unknown error");
      return createErrorOutput(error);
    }
  }

  async safeSet<const TData extends Json, const Key extends string>(
    entry: IZodCacheEntry<TData, Key>,
    value: TData,
    ttl?: number
  ): Promise<SafeOutput<void>> {
    try {
      await this.set(entry, value, ttl);
      return createSuccessOutput(undefined);
    } catch (e) {
      const error = e instanceof Error ? e : new Error("unknown error");
      return createErrorOutput(error);
    }
  }
}
