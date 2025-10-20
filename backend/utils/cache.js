import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

/**
 * Cache-aside helper.
 * - key: string cache key
 * - ttl: seconds to live
 * - fetcher: async function returning the final JSON-safe value to cache
 * - opts.bypass: allow ?refresh=1 to bypass cache (for manual refresh)
 */
export async function getOrSetCache(key, ttl, fetcher, opts = {}) {
    if (!opts?.bypass) {
        const cached = await redis.get(key);
        if (cached !== null && cached !== undefined) {
            console.log(`[cache HIT] ${key}`)
            return cached
        };
    }

    console.log(`[cache MISS] ${key}`)
    const data = await fetcher();

    if (data == null || data == undefined) return data;
    await redis.set(key, data, { ex: ttl });
    return data;
}
