import { GraphQLServer, PubSub } from 'graphql-yoga';

import Mutation from './resolvers/Mutation';
import Query from './resolvers/Query';
import Subscription from './resolvers/Subscription';

/* Create the GraphQL Yoga Server */

const pubsub = new PubSub();

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
      Subscription,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, pubsub }),
  });
}

export { createServer };
