import fastify, { FastifyRequest } from 'fastify';
import fastifyOas from 'fastify-oas';
import { Static, Type } from '@sinclair/typebox';

const app = fastify({ logger: true });

// Register fastify-oas so that any route we define from here onwards
// appears in the generated documentation
app.register(fastifyOas, {
  swagger: {
    info: {
      title: 'My cool API',
      version: '1.0.0',
    },
  },
  exposeRoute: true,
});

// Here we’re defining the schema for our request body using TypeBox
const requestBodySchema = Type.Object({
  name: Type.String({
    example: 'My cool thing',
    description: 'The name of the thing',
  }),
  count: Type.Number({ example: 123 }),
  coolEnough: Type.Optional(Type.Boolean()),
});

// We grab the type that TypeBox has created from our schema. We’ll be using this
// in the route handler code
type RequestBody = Static<typeof requestBodySchema>;

// We take a similar approach for our response schemas, except we have one per response code
const responseSchema = {
  200: Type.Object({
    thingId: Type.String({ example: 'abc' }),
  }),
};
type ResponseBody = Static<typeof responseSchema['200']>;

// Create our route, composing route schema and adding the route handling code
app.post(
  '/things',
  {
    schema: {
      body: requestBodySchema,
      response: responseSchema,
    },
  },
  async (
    // Do a bit of TypeScript fiddling with this parameter to override the default
    // request body type (any) with the one from our schema
    request: Omit<FastifyRequest, 'body'> & { body: RequestBody }
  ): Promise<ResponseBody> => {
    // Use the request body to do stuff
    app.log.info(`Received request to add a thing called ${request.body.name}`);

    // ☝️ Just for kicks, try replacing the above line with the following one. You’ll get
    // a type error because we’ve not defined a ‘shame’ property in our request body
    // schema ✨

    // app.log.info(`Received request to add a thing called ${request.body.shame}`);

    return { thingId: 'xyz' };

    // ☝️ Just for kicks, try adding a new property to this returned object. You’ll get
    // another type error unless you also add it to the schema, updating the request
    // validation and api documentation ✨
  }
);

app.listen(3000).then(() => app.log.info(`server listening on 3000`));
