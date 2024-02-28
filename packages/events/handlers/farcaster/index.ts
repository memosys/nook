import {
  EntityClient,
  FarcasterClient,
  FeedClient,
  NookClient,
} from "@nook/common/clients";
import {
  FarcasterCast,
  FarcasterCastReaction,
} from "@nook/common/prisma/farcaster";
import {
  EntityEvent,
  EntityResponse,
  FarcasterEventType,
} from "@nook/common/types";

export class FarcasterProcessor {
  private nookClient: NookClient;
  private entityClient: EntityClient;
  private farcasterClient: FarcasterClient;
  private feedClient: FeedClient;

  constructor() {
    this.entityClient = new EntityClient();
    this.farcasterClient = new FarcasterClient();
    this.feedClient = new FeedClient();
    this.nookClient = new NookClient();
  }

  async process(event: EntityEvent) {
    switch (event.source.type) {
      case FarcasterEventType.CAST_ADD: {
        await this.processCastAdd(event.data as FarcasterCast);
        break;
      }
      default:
        // console.error(`Unknown event type: ${event.source.type}`);
        return;
    }
  }

  async processCastReactionAdd(data: FarcasterCastReaction) {
    await this.farcasterClient.incrementEngagement(
      data.hash,
      data.reactionType === 1 ? "likes" : "recasts",
    );
  }

  async processCastReactionRemove(data: FarcasterCastReaction) {
    await this.farcasterClient.decrementEngagement(
      data.hash,
      data.reactionType === 1 ? "likes" : "recasts",
    );
  }

  async processCastAdd(data: FarcasterCast) {
    const promises = [];
    promises.push(this.farcasterClient.getCast(data.hash));

    if (data.parentUrl) {
      promises.push(
        this.feedClient.addToFeed(`channel:${data.parentUrl}`, data.hash),
      );
    }

    if (data.parentHash) {
      promises.push(
        this.feedClient.addToFeed(
          `user:replies:${data.fid.toString()}`,
          data.hash,
        ),
      );
      promises.push(
        this.farcasterClient.incrementEngagement(data.parentHash, "replies"),
      );
    } else {
      promises.push(
        this.feedClient.addToFeed(
          `user:casts:${data.fid.toString()}`,
          data.hash,
        ),
      );
    }

    for (const embed of this.farcasterClient.getCastEmbeds(data)) {
      promises.push(
        this.farcasterClient.incrementEngagement(embed.hash, "quotes"),
      );
    }

    await Promise.all(promises);

    if (!data.parentHash) {
      const followers = await this.farcasterClient.getFollowers(data.fid);
      await this.feedClient.addToFeeds(
        followers.map(({ fid }) => `user:following:${fid.toString()}`),
        data.hash,
      );
    }
  }

  async processCastRemove(data: FarcasterCast) {
    const promises = [];

    if (data.parentUrl) {
      promises.push(
        this.feedClient.removeFromFeed(`channel:${data.parentUrl}`, data.hash),
      );
    }

    if (data.parentHash) {
      promises.push(
        this.feedClient.removeFromFeed(
          `user:replies:${data.fid.toString()}`,
          data.hash,
        ),
      );
      promises.push(
        this.farcasterClient.decrementEngagement(data.parentHash, "replies"),
      );
    } else {
      promises.push(
        this.feedClient.removeFromFeed(
          `user:casts:${data.fid.toString()}`,
          data.hash,
        ),
      );
    }

    for (const embed of this.farcasterClient.getCastEmbeds(data)) {
      promises.push(
        this.farcasterClient.decrementEngagement(embed.hash, "quotes"),
      );
    }

    await Promise.all(promises);

    if (!data.parentHash) {
      const followers = await this.farcasterClient.getFollowers(data.fid);
      await this.feedClient.removeFromFeeds(
        followers.map(({ fid }) => `user:following:${fid.toString()}`),
        data.hash,
      );
    }
  }
}
