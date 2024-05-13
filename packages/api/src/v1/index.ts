import { settingsRoutes } from "./routes/settings";
import { userRoutes } from "./routes/user";
import { FastifyInstance } from "fastify";

export const registerV1Routes = async (fastify: FastifyInstance) => {
  fastify.register(userRoutes, { prefix: "/v1" });
  fastify.register(settingsRoutes, { prefix: "/v1" });
};