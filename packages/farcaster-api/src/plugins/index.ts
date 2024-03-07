import fp from "fastify-plugin";
import { PrismaClient } from "@nook/common/prisma/farcaster";
import {  FarcasterCacheClient } from "@nook/common/clients";

declare module "fastify" {
  interface FastifyInstance {
    farcaster: {
      client: PrismaClient;
    };
    cache: {
      client: FarcasterCacheClient;
    };
  }
}

export const farcasterPlugin = fp(async (fastify, opts) => {
  const client = new PrismaClient();
  await client.$connect();
  fastify.decorate("farcaster", { client });
  fastify.addHook("onClose", async (fastify) => {
    await fastify.farcaster.client.$disconnect();
  });
});

export const cachePlugin = fp(async (fastify, opts) => {
  const client = new FarcasterCacheClient();
  await client.connect();
  fastify.decorate("cache", { client });
  fastify.addHook("onClose", async (fastify) => {
    await fastify.cache.client.close();
  });
});