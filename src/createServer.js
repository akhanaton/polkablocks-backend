import { GraphQLServer } from 'graphql-yoga';

import Query from './resolvers/Query';
import { connectToChain } from '../services/substrateChain';

/* Create the GraphQL Yoga Server */

let api;

(async () => {
  api = await connectToChain();
})();

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, api }),
  });
}

export { createServer };
