import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import { QueueName, getQueue } from "@nook/common/queues";
import fastify from "fastify";

const setupBullBoardServerAdapter = () => {
  const serverAdapter = new FastifyAdapter();
  const queues = Object.values(QueueName).map(
    (queueName) => new BullMQAdapter(getQueue(queueName)),
  );
  createBullBoard({
    queues,
    serverAdapter,
  });
  serverAdapter.setBasePath("/");
  return serverAdapter;
};

const setupServer = () => {
  const server = fastify();
  const serverAdapter = setupBullBoardServerAdapter();
  server.register(serverAdapter.registerPlugin(), {
    prefix: "/",
    basePath: "/",
  });

  return server;
};

const run = async () => {
  const server = setupServer();
  const port = Number(process.env.PORT || "3000");
  await server.listen({ port, host: "0.0.0.0" });
  console.log(`Listening on :${port}`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
