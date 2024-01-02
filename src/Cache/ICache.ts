import { CacheValueType } from "@/Cache/Cache.types";

/**
 * A basic cache interface
 */
export default interface ICache {
  get(key: string): Promise<CacheValueType | undefined>;

  set(key: string, value: CacheValueType, ttl?: number): Promise<void>;

  clear(): Promise<void>;

  remove(key: string): Promise<void>;

  has(key: string): Promise<boolean>;

  dump(): Promise<Record<string, CacheValueType>>;
}
