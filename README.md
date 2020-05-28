# Fastify type-safe API example

A demonstration of how to marry [fastify](https://www.fastify.io/), [TypeBox](https://github.com/sinclairzx81/typebox) and [fastify-oas](https://github.com/SkeLLLa/fastify-oas) to create an API that has type safety spanning its route handling code, request validation, and API documentation.

## Give it a spin

Get started with

```
npm i
npm start
```

Make a request to the API:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Some cool thing", "count":23}' \
  http://localhost:3000/things
```

Fiddle request data in that curl to see how the validation works

See the generated API documentation at http://localhost:3000/documentation
