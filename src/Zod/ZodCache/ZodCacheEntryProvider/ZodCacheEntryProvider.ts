import { ZodCacheConfig } from "@/Zod/ZodCache/ZodCacheConfig.types";
import ZodCacheEntry from "@/Zod/ZodCache/ZodCacheEntry/ZodCacheEntry";
import IZodCacheEntryProvider from "./IZodCacheEntryProvider";
import { IZodCacheEntry } from "../ZodCacheEntry/IZodCacheEntry";
import { z } from "zod";

/**
 * Built around a const config it simply allows to get a statically typed cacheEntry object representation by it's key
 */
export default class ZodCacheEntryProvider<const C extends ZodCacheConfig> implements IZodCacheEntryProvider<C> {
  constructor(private readonly config: C) {}

  getEntry<const Key extends keyof C & string>(key: Key): IZodCacheEntry<z.TypeOf<C[Key]>, Key> {
    if (!this.config[key]) throw new Error(`No entry with key "${key}" found in ZodEntryProvider config`);
    return new ZodCacheEntry(key, this.config[key]);
  }
}
