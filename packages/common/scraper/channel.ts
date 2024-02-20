import { Channel, Entity } from "@nook/common/types";
import { MongoClient, MongoCollection } from "../mongo";

type WarpcastChannelData = {
  id: string;
  url: string;
  name: string;
  description: string;
  imageUrl: string;
  leadFid?: number;
  createdAt: number;
};

export const getOrCreateChannel = async (
  client: MongoClient,
  contentId: string,
) => {
  const existingChannel = await client.findChannel(contentId);
  if (existingChannel) {
    return existingChannel;
  }

  const response = await fetch("https://api.warpcast.com/v2/all-channels");
  if (!response.ok) {
    throw new Error("Failed to fetch channels");
  }

  const data = await response.json();
  const channels: WarpcastChannelData[] = data?.result?.channels;
  if (!channels) {
    throw new Error("Channel not found");
  }

  const channelData = channels.find((channel) => channel.url === contentId);
  if (!channelData) {
    throw new Error("Channel not found");
  }

  let entity: Entity | undefined;
  if (channelData.leadFid) {
    entity = (await client
      .getCollection<Entity>(MongoCollection.Entity)
      .findOne({
        "farcaster.fid": channelData.leadFid.toString(),
      })) as Entity | undefined;
  }

  const channel: Channel = {
    contentId,
    slug: channelData.id,
    name: channelData.name,
    description: channelData.description,
    imageUrl: channelData.imageUrl,
    creatorId: entity?._id,
    createdAt: new Date(channelData.createdAt * 1000),
    updatedAt: new Date(),
  };

  await client.upsertChannel(channel);

  return channel;
};