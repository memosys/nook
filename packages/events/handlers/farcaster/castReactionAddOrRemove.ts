import { MongoClient } from "@flink/common/mongo";
import {
  ContentEngagementType,
  EventAction,
  EventActionData,
  EventActionType,
  EventType,
  FarcasterCastReactionData,
  FarcasterReactionType,
  RawEvent,
  UserEvent,
} from "@flink/common/types";
import { ObjectId } from "mongodb";
import { sdk } from "@flink/sdk";
import { toFarcasterURI } from "@flink/farcaster/utils";
import { publishContentRequest } from "@flink/content/utils";
import { Identity } from "@flink/identity/types";

export const handleCastReactionAddOrRemove = async (
  client: MongoClient,
  rawEvent: RawEvent<FarcasterCastReactionData>,
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

  const identities = await sdk.identity.getForFids([
    rawEvent.data.fid,
    rawEvent.data.targetFid,
  ]);

  const fidToIdentity = identities.reduce(
    (acc, identity) => {
      acc[identity.socialAccounts[0].platformId] = identity;
      return acc;
    },
    {} as Record<string, Identity>,
  );

  const eventId = new ObjectId();
  const userId = fidToIdentity[rawEvent.data.fid].id;
  const contentId = toFarcasterURI({
    fid: rawEvent.data.targetFid,
    hash: rawEvent.data.targetHash,
  });
  const actions: EventAction<EventActionData>[] = [
    {
      _id: new ObjectId(),
      eventId,
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

  const event: UserEvent<FarcasterCastReactionData> = {
    ...rawEvent,
    _id: eventId,
    userId,
    actions: actions.map(({ _id }) => _id),
    createdAt: actions[0].createdAt,
  };

  await Promise.all([
    client.upsertEvent(event),
    client.upsertActions(actions),
    incrementOrDecrement(client, contentId, rawEvent),
    publishContentRequest({
      submitterId: fidToIdentity[rawEvent.data.targetFid].id,
      contentId,
    }),
  ]);
};

const incrementOrDecrement = async (
  client: MongoClient,
  contentId: string,
  rawEvent: RawEvent<FarcasterCastReactionData>,
) => {
  if (rawEvent.backfill) return;

  const contentEngagementType =
    rawEvent.data.reactionType === FarcasterReactionType.LIKE
      ? ContentEngagementType.LIKES
      : ContentEngagementType.REPOSTS;

  const fn =
    rawEvent.source.type === EventType.CAST_REACTION_REMOVE
      ? client.decrementEngagement
      : client.incrementEngagement;

  await fn(contentId, contentEngagementType, rawEvent.source.service);
};