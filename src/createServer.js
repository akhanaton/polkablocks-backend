import { GraphQLServer, PubSub } from 'graphql-yoga';
import redis from 'redis';
import bluebird from 'bluebird';
import Query from './resolvers/Query';
import Subscription from './resolvers/Subscription';
import { connectToChain } from '../services/substrateChain';

/* Create the GraphQL Yoga Server */
/* eslint-disable global-require */

let api;
let client;

bluebird.promisifyAll(redis.RedisClient.prototype);
const pubSub = new PubSub();

(async () => {
  api = await connectToChain();
  if (process.env.REDIS_URL) {
    const rtg = require('url').parse(process.env.REDIS_URL);
    client = require('redis').createClient(rtg.port, rtg.hostname);

    client.auth(rtg.auth.split(':')[1]);
  } else {
    client = redis.createClient();
  }

  client.on('connect', async function() {
    console.log('Redis client connected');
  });

  client.on('error', function(err) {
    console.log(`Something went wrong ${err}`);
  });
})();

function createServer() {
  return new GraphQLServer({
    typeDefs: `${__dirname}/schema.graphql`,
    resolvers: {
      Query,
      Subscription,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, api, client, pubSub }),
  });
}

export { createServer, pubSub };
