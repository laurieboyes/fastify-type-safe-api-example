import fastify, { FastifyRequest } from 'fastify';
import fastifyOas from 'fastify-oas';
import { Static, Type } from '@sinclair/typebox';
import { builtinModules } from 'module';

const app = fastify({ logger: true });

//
// Defining our route schemas

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

//
// Registering our documentation plugin

app.register(fastifyOas, {
  swagger: {
    info: {
      title: 'My cool API',
      version: '1.0.0',
    },
  },
  exposeRoute: true,
});

//
// Configuring our route, adding route handler code
app.post(
  '/things',
  {
    schema: {
      body: requestBodySchema,
      response: responseSchema,
    },
  },
  async (
    request: Omit<FastifyRequest, 'body'> & { body: RequestBody }
  ): Promise<ResponseBody> => {
    app.log.info(`Received request to add a thing called ${request.body.name}`);
    return { thingId: 'xyz' };
  }
);

app.listen(3000).then(() => app.log.info(`server listening on 3000`));
