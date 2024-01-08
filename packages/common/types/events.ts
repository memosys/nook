import { ObjectId } from "mongodb";
import {
  FarcasterCastAddData,
  FarcasterCastReactionData,
  FarcasterUrlReactionData,
} from "./sources";

/**
 * Supported event services
 */
export enum EventService {
  FARCASTER = "farcaster",
}

export enum EventType {
  CAST_ADD = "castAdd",
  CAST_REACTION_ADD = "castReactionAdd",
  CAST_REACTION_REMOVE = "castReactionRemove",
  URL_REACTION_ADD = "urlReactionAdd",
  URL_REACTION_REMOVE = "urlReactionRemove",
  LINK_ADD = "linkAdd",
  LINK_REMOVE = "linkRemove",
}

export type EventSource = {
  /** Service the event was made on */
  service: EventService;

  /** Type of event */
  type: EventType;

  /** ID in the source system */
  id: string;

  /** User ID in the source system */
  userId: string;
};

/**
 * Raw event payload sent from any source service
 */
export type RawEvent<T> = {
  /** Event ID */
  eventId: string;

  /** Source data */
  source: EventSource;

  /** Timestamp for when the event occurred */
  timestamp: Date;

  /** Raw data sent from the source */
  data: T;
};

/**
 * Event object after being processed by the event service
 */
export type UserEvent<T> = RawEvent<T> & {
  /** Identity of user who triggered the event */
  userId: string;

  /** List of references to event actions parsed from this event */
  actions: ObjectId[];

  /** Timestamp for when the event was created */
  createdAt: Date;
};
