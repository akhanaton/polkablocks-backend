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
    typeDefs: `${__dirname}/schema.graphql`,
    resolvers: {
      Query,
      engine: {
        apiKey: 'service:akhanaton-5337:z4rWzxfNJAcxfPBsfnKzGw',
      },
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, api }),
  });
}

export { createServer };
