import fastify from 'fastify';
import fastifyOas from 'fastify-oas';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Static, Type } from '@sinclair/typebox';

const app: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({ logger: true });

const requestBodySchema = Type.Object({
  name: Type.String({
    example: 'My cool thing',
    description: 'The name of the thing',
  }),
  count: Type.Number({ example: 123 }),
  coolEnough: Type.Optional(Type.Boolean()),
});
type RequestBody = Static<typeof requestBodySchema>;

const responseSchema = {
  200: Type.Object({
    thingId: Type.String({ example: 'abc' }),
  }),
};
type ResponseBody = Static<typeof responseSchema['200']>;

app.register(fastifyOas, {
  swagger: {
    info: {
      title: 'My cool API',
      version: '1.0.0',
    },
  },
  exposeRoute: true,
});

app.post(
  '/things',
  {
    schema: {
      body: requestBodySchema,
      response: responseSchema,
    },
  },
  async (request): Promise<ResponseBody> => {
    const requestBody: RequestBody = request.body;

    app.log.info(`Get a request to add a thing called ${requestBody.name}`);

    // TODO do something with thing

    return { thingId: 'xyz' };
  }
);

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
