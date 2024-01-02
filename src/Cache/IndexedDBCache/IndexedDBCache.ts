import { IDBPDatabase, openDB } from "idb";
import { CacheValueType } from "@/Cache/Cache.types";
import ICache from "@/Cache/ICache";
import { IndexedDBRecordType, isIndexedDBRecordType } from "@/Cache/IndexedDBCache/IndexedDBCache.types";

export const STORE_NAME = "keyValueStore";

/**
 * On ICache implementation using IndexedDB.
 * (read this article for pros&cons agains localstorage)
 * (https://medium.com/@julienetienne/stop-using-localstorage-64a6d6805da8)
 */
export default class IndexedDBCache implements ICache {
  private dbPromise: Promise<IDBPDatabase<CacheValueType>>;

  constructor() {
    this.dbPromise = openDB("euronewsCache", 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  }

  async get(key: string) {
    const db = await this.dbPromise;
    const entry = await db.get(STORE_NAME, key);

    // case no entry
    if (!entry) {
      return undefined;
    }

    // case cacheValue type
    if (!isIndexedDBRecordType(entry)) {
      throw Error(
        `invalid entry type for key [${key}]. Please properly reset this entry. ${JSON.stringify(entry, undefined, 2)}`
      );
    }

    // case expired
    if (IndexedDBCache.isExpired(entry)) {
      await this.remove(key);
    }

    return entry.value;
  }

  async set(key: string, value: CacheValueType, ttl?: number) {
    const db = await this.dbPromise;
    const expiry = typeof ttl !== "undefined" ? Date.now() + ttl : undefined;
    const record: IndexedDBRecordType = {
      key,
      value,
      expiry,
    };
    db.put(STORE_NAME, record, key);
  }

  async remove(key: string) {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, key);
  }

  async dump() {
    const db = await this.dbPromise;
    const keys = await db.getAllKeys(STORE_NAME);
    const promises = keys.map(
      async (key): Promise<[string, CacheValueType | undefined]> => [key.toString(), await this.get(key.toString())]
    );
    const results = await Promise.allSettled(promises);
    const output = results.reduce<Record<string, CacheValueType>>((acc, result) => {
      if (result.status === "rejected") {
        console.error(result.reason);
        return acc;
      }
      const [key, value] = result.value;
      if (typeof value === "undefined") return acc;
      acc[key] = value;
      return acc;
    }, {});
    return output;
  }

  async clear() {
    const db = await this.dbPromise;
    await db.clear(STORE_NAME);
  }

  async has(key: string) {
    return !!(await this.get(key));
  }

  static isExpired(cacheEntry: IndexedDBRecordType): boolean {
    return typeof cacheEntry.expiry !== "undefined" && cacheEntry.expiry <= Date.now();
  }
}
