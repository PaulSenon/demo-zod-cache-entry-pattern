import { z } from "zod";
import IndexedDBCache from "@/Cache/IndexedDBCache/IndexedDBCache";
import ZodCache from "@/Zod/ZodCache/ZodCache";
import ICache from "@/Cache/ICache";
import { IZodCache } from "@/Zod/ZodCache/IZodCache";
import ZodCacheEntryProvider from "@/Zod/ZodCache/ZodCacheEntryProvider/ZodCacheEntryProvider";

// my types/schemas
const MyType = z.object({
  key1: z.string(),
  key2: z.boolean(),
  key3: z.array(z.union([z.number(), z.boolean()])),
});
type MyType = z.infer<typeof MyType>;

// define cache and zod layer (one instance for your whole app)
const cache: ICache = new IndexedDBCache();
const zodCache: IZodCache = new ZodCache(cache);

// build your cache entry provider instance from your config
const cacheConfig = new ZodCacheEntryProvider({
  myKey: MyType,
  myOtherKey: z.boolean(),
});

// runtime
(async () => {
  // one entry ref for runtime/buildtime typecheck for get/set
  // name is autocompleted and type is inferred
  const myEntry = cacheConfig.getEntry("myKey");
  const myOtherEntry = cacheConfig.getEntry("myOtherKey");

  /**
   * SET from cache entry
   */

  // set from entry, strongly typed and will only allow valid data a buildtime & runtime
  await zodCache
    .set(myEntry, {
      key1: "hello",
      key2: false,
      key3: [1, 2, 3, true],
    })
    // mind catching runtime errors to handle invalid data
    .catch(console.error);

  // or using a safe setter that will return a SafeOutput (never throw an error at runtime)
  // this enforce you to handle errors and will warn you at runtime if you don't
  // (more strongly typed)
  const setResult = await zodCache.safeSet(myOtherEntry, true);
  if (setResult.status === "error") console.error(setResult.error);

  /**
   * GET from cache entry
   */

  // get from entry, will always return valid data (runtime safe)
  const myOtherData = await zodCache
    .get(myEntry)
    // mind catching runtime errors to handle invalid data
    .catch(console.error);
  // everything is then strongly typed and it will hint you any error at buildtime
  console.log(myOtherData?.key3.length);

  // or using a safe getter that will return a SafeOutput (never throw an error at runtime)
  // this enforce you to handle errors and will warn you at runtime if you don't
  // (more strongly typed)
  // output.value will always be set (error or not) so you can just handle error case as undefined cache value
  // by juste never handling the output.status === 'error' case.
  const myData = await zodCache.safeGet(myOtherEntry);
  if (myData.status === "error") console.error(myData.error);
  console.log(myData.value);

  /**
   * Use cache without zod layer
   * (not recommended, but you can if you need to)
   * (with this you will have no type checking and will have to do it manually)
   */
  await cache.set("myKey", "this is a string");
  const data = await cache.get("myKey");
  // then data is not typed
})();
