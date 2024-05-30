import {
  GetFarcasterCastClientRequest,
  GetFarcasterCastRepliesRequest,
  GetFarcasterCastRequest,
  GetFarcasterCastsRequest,
} from "@nook/common/types";
import { FastifyInstance } from "fastify";
import { FarcasterService } from "../service/farcaster";

export const castRoutes = async (fastify: FastifyInstance) => {
  fastify.register(async (fastify: FastifyInstance) => {
    const service = new FarcasterService(fastify);

    fastify.get<{
      Params: GetFarcasterCastRequest;
    }>("/casts/:hash", async (request, reply) => {
      const casts = await service.getCastsFromHashes(
        [request.params.hash],
        request.headers["x-viewer-fid"] as string,
        true,
      );

      if (casts.length === 0) {
        reply.status(404).send({ message: "Cast not found" });
        return;
      }

      const cast = casts[0];
      if (cast.parentHash && !cast.ancestors) {
        const ancestors = await service.getCastAncestors(
          cast,
          request.headers["x-viewer-fid"] as string,
        );
        cast.ancestors = ancestors;
      }

      if (!cast.thread) {
        const thread = await service.getCastThread(
          cast,
          request.headers["x-viewer-fid"] as string,
        );
        cast.thread = thread;
      }

      reply.send(cast);
    });

    fastify.get<{
      Params: GetFarcasterCastRepliesRequest;
      Querystring: { cursor?: string };
    }>("/casts/:hash/replies", async (request, reply) => {
      const response = await service.getCastReplies(
        request.params.hash,
        request.query.cursor,
        request.headers["x-viewer-fid"] as string,
      );
      reply.send(response);
    });

    fastify.get<{
      Params: GetFarcasterCastRepliesRequest;
      Querystring: { cursor?: string };
    }>("/casts/:hash/replies/new", async (request, reply) => {
      const response = await service.getNewCastReplies(
        request.params.hash,
        request.query.cursor,
        request.headers["x-viewer-fid"] as string,
      );
      return reply.send(response);
    });

    fastify.get<{
      Params: GetFarcasterCastRepliesRequest;
      Querystring: { cursor?: string };
    }>("/casts/:hash/replies/top", async (request, reply) => {
      const response = await service.getTopCastReplies(
        request.params.hash,
        request.query.cursor,
        request.headers["x-viewer-fid"] as string,
      );
      return reply.send(response);
    });

    fastify.get<{
      Params: GetFarcasterCastRepliesRequest;
      Querystring: { cursor?: string };
    }>("/casts/:hash/quotes", async (request, reply) => {
      const response = await service.getCastQuotes(
        request.params.hash,
        request.query.cursor,
        request.headers["x-viewer-fid"] as string,
      );
      reply.send(response);
    });

    fastify.get<{
      Params: GetFarcasterCastRepliesRequest;
      Querystring: { cursor?: string };
    }>("/casts/:hash/likes", async (request, reply) => {
      const response = await service.getCastLikes(
        request.params.hash,
        request.query.cursor,
        request.headers["x-viewer-fid"] as string,
      );
      reply.send(response);
    });

    fastify.get<{
      Params: GetFarcasterCastRepliesRequest;
      Querystring: { cursor?: string };
    }>("/casts/:hash/recasts", async (request, reply) => {
      const response = await service.getCastRecasts(
        request.params.hash,
        request.query.cursor,
        request.headers["x-viewer-fid"] as string,
      );
      reply.send(response);
    });

    fastify.post<{
      Body: GetFarcasterCastsRequest;
    }>("/casts", async (request, reply) => {
      const casts = await service.getCastsFromHashes(
        request.body.hashes,
        request.headers["x-viewer-fid"] as string,
      );
      reply.send({ data: casts });
    });

    fastify.get<{
      Params: GetFarcasterCastClientRequest;
    }>("/casts/:hash/client", async (request, reply) => {
      const fid = await service.getCastAppFidByHash(request.params.hash);
      reply.send({ fid });
    });
  });
};