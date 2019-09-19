import { GraphQLServer, PubSub } from 'graphql-yoga';

import Query from './resolvers/Query';
import Subscription from './resolvers/Subscription';
import { connectToChain } from '../services/substrateChain';

/* Create the GraphQL Yoga Server */

const pubSub = new PubSub();
let api;

(async () => {
  api = await connectToChain();
})();

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Query,
      Subscription,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, pubSub, api }),
  });
}

export { createServer, pubSub };
