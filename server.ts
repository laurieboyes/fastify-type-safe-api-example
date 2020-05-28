import fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

const app: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    const port = 3000;
    await app.listen(port);
    app.log.info(`server listening on ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
