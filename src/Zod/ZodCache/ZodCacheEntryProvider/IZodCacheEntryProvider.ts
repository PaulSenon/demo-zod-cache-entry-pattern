import { IZodCacheEntry } from "@/Zod/ZodCache/ZodCacheEntry/IZodCacheEntry";

import { z } from "zod";
import { ZodCacheConfig } from "../ZodCacheConfig.types";

/**
 * Built around a const config it simply allows to get a statically typed cacheEntry object representation by it's key
 */
export default interface IZodCacheEntryProvider<C extends ZodCacheConfig> {
  getEntry<const Key extends keyof C & string>(key: Key): IZodCacheEntry<z.TypeOf<C[Key]>, Key>;
}
