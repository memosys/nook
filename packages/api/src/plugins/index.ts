import fp from "fastify-plugin";
import { MongoClient } from "@nook/common/mongo";
import { RedisClient } from "@nook/common/cache";
import { PrismaClient } from "@nook/common/prisma/nook";
import { HubRpcClient, getSSLHubRpcClient } from "@farcaster/hub-nodejs";

declare module "fastify" {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
    };
    nook: {
      client: PrismaClient;
    };
    farcasterHub: {
      client: HubRpcClient;
    };
    cache: {
      client: RedisClient;
    };
  }
}

export const mongoPlugin = fp(async (fastify, opts) => {
  const client = new MongoClient();
  await client.connect();
  fastify.decorate("mongo", { client });
  fastify.addHook("onClose", async (fastify) => {
    await fastify.mongo.client.close();
  });
});

export const nookPlugin = fp(async (fastify, opts) => {
  const client = new PrismaClient();
  await client.$connect();
  fastify.decorate("nook", { client });
  fastify.addHook("onClose", async (fastify) => {
    await fastify.nook.client.$disconnect();
  });
});

export const farcasterHubPlugin = fp(async (fastify, opts) => {
  const client = getSSLHubRpcClient(process.env.HUB_RPC_ENDPOINT as string);
  fastify.decorate("farcasterHub", { client });
  fastify.addHook("onClose", async (fastify) => {
    fastify.farcasterHub.client.close();
  });
});

export const cachePlugin = fp(async (fastify, opts) => {
  const client = new RedisClient();
  await client.connect();
  fastify.decorate("cache", { client });
  fastify.addHook("onClose", async (fastify) => {
    await fastify.cache.client.close();
  });
});
