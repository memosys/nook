import { MongoClient, MongoCollection } from "@flink/common/mongo";
import {
  ContentEngagementType,
  EventAction,
  EventActionData,
  EventActionType,
  EventType,
  FarcasterReactionType,
  FarcasterUrlReactionData,
  RawEvent,
  UserEvent,
} from "@flink/common/types";
import { ObjectId } from "mongodb";
import { sdk } from "@flink/sdk";
import { publishContentRequest } from "@flink/common/queues";

export const handleUrlReactionAddOrRemove = async (
  client: MongoClient,
  rawEvent: RawEvent<FarcasterUrlReactionData>,
) => {
  let eventActionType: EventActionType | undefined;

  const isRemove = [
    EventType.CAST_REACTION_REMOVE,
    EventType.URL_REACTION_REMOVE,
  ].includes(rawEvent.source.type);

  if (rawEvent.data.reactionType === FarcasterReactionType.LIKE) {
    eventActionType = isRemove ? EventActionType.UNLIKE : EventActionType.LIKE;
  } else if (rawEvent.data.reactionType === FarcasterReactionType.RECAST) {
    eventActionType = isRemove
      ? EventActionType.UNREPOST
      : EventActionType.REPOST;
  }

  if (!eventActionType) {
    throw new Error(
      `[events] [${rawEvent.source.service}] [${rawEvent.source.type}] unknown reaction type`,
    );
  }

  const identities = await sdk.identity.getForFids([rawEvent.data.fid]);

  const userId = identities[0].id;
  const contentId = rawEvent.data.url;
  const actions: EventAction<EventActionData>[] = [
    {
      _id: new ObjectId(),
      eventId: rawEvent.eventId,
      source: rawEvent.source,
      timestamp: rawEvent.timestamp,
      userId,
      userIds: [userId],
      contentIds: [contentId],
      createdAt: new Date(),
      type: eventActionType,
      data: {
        userId,
        contentId,
      },
    },
  ];

  const event: UserEvent<FarcasterUrlReactionData> = {
    ...rawEvent,
    userId,
    actions: actions.map(({ _id }) => _id),
    createdAt: actions[0].createdAt,
  };

  await Promise.all([
    client.upsertEvent(event),
    client.upsertActions(actions),
    incrementOrDecrement(client, contentId, rawEvent),
    publishContentRequest({
      submitterId: userId,
      contentId,
    }),
  ]);

  if (isRemove) {
    const collection = client.getCollection(MongoCollection.Actions);
    await collection.updateOne(
      {
        "source.id": rawEvent.source.id,
        type:
          eventActionType === EventActionType.UNLIKE
            ? EventActionType.LIKE
            : EventActionType.REPOST,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
    );
  }
};

const incrementOrDecrement = async (
  client: MongoClient,
  contentId: string,
  rawEvent: RawEvent<FarcasterUrlReactionData>,
) => {
  const contentEngagementType =
    rawEvent.data.reactionType === FarcasterReactionType.LIKE
      ? ContentEngagementType.LIKES
      : ContentEngagementType.REPOSTS;

  const fn =
    rawEvent.source.type === EventType.URL_REACTION_REMOVE
      ? client.decrementEngagement
      : client.incrementEngagement;

  await fn(contentId, contentEngagementType, rawEvent.source.service);
};
