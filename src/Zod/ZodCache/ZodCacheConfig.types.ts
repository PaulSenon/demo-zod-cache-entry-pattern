import { z } from "zod";

export type ZodCacheConfig = {
  [key: string]: z.Schema;
};

/**
 * This is simply a buildtime typechecker for you config to have more readable error if you want to build you zod cache config externally from an IZodCacheEntryProvider constructor.
 */
export function checkZodCacheConfig<const C extends ZodCacheConfig>(config: C): C {
  return config;
}
