import {
  EntityClient,
  FarcasterClient,
  FeedClient,
  NookClient,
} from "@nook/common/clients";
import { FarcasterCast } from "@nook/common/prisma/farcaster";
import { EntityEvent, FarcasterEventType } from "@nook/common/types";

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

  async processCastAdd(data: FarcasterCast) {
    const cast = await this.farcasterClient.getCast(data.hash);
    const fids = this.farcasterClient.getFidsFromCast(cast);
    await this.entityClient.getEntitiesByFid(fids);
    if (data.parentUrl) {
      await this.nookClient.getChannel(data.parentUrl);
      await this.feedClient.addToFeed(data.parentUrl, cast.hash);
    }
  }
}