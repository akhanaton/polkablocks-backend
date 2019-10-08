import { getSessionInfo, getHead } from '../services/polkadot';

const Subscription = {
  bestHead: {
    async subscribe(parent, args, { api, pubSub }, info) {
      getHead(api, pubSub);
      return pubSub.asyncIterator('headChannel');
    },
  },
  sessionInfo: {
    async subscribe(parent, args, { api, pubSub }, info) {
      getSessionInfo(api, pubSub);
      return pubSub.asyncIterator('sessionChannel');
    },
  },
  heartbeats: {
    async subscribe(parent, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('heartsChannel');
    },
  },
};

export { Subscription as default };
