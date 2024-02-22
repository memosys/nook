import {
  Content,
  ContentData,
  EntityEvent,
  EntityEventData,
  EventAction,
  EventActionData,
} from "@nook/common/types";

export type EventHandlerResponseEvent = {
  event: EntityEvent<EntityEventData>;
  actions: EventAction<EventActionData>[];
};

export type EventHandlerResponse = {
  events: EventHandlerResponseEvent[];
  contents?: Content<ContentData>[];
};