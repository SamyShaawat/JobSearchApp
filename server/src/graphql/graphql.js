import { createHandler } from "graphql-http/lib/use/express";
import { schema, rootValue } from "./schema.js";

export const graphqlMiddleware = createHandler({
    schema,
    rootValue,
    graphiql: true
});
