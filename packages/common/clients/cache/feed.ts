import { RedisClient } from "./base";
import { FarcasterCastFeedCacheItem } from "../../types/feed";

export class FeedCacheClient {
  private redis: RedisClient;

  FARCASTER_FEED_FOLLOWING_CACHE_PREFIX = "feed:farcaster:following";

  constructor(redis: RedisClient) {
    this.redis = redis;
  }

  async getFarcasterFollowingFeed(
    fid: string,
    cursor?: number,
  ): Promise<FarcasterCastFeedCacheItem[]> {
    const result = await this.redis.getSet(
      `${this.FARCASTER_FEED_FOLLOWING_CACHE_PREFIX}:${fid}`,
      cursor,
    );
    const items: FarcasterCastFeedCacheItem[] = [];

    // Process the result array in steps of 2 to pair each item with its score
    for (let i = 0; i < result.length; i += 2) {
      const timestamp = parseFloat(result[i + 1]);
      items.push({ value: JSON.parse(result[i]), timestamp });
    }

    return items;
  }

  async setFarcasterFollowingFeed(
    fid: string,
    casts: FarcasterCastFeedCacheItem[],
  ) {
    return await this.redis.batchAddToSet(
      `${this.FARCASTER_FEED_FOLLOWING_CACHE_PREFIX}:${fid}`,
      casts,
    );
  }
}
