import { getSessionInfo, getHeartbeats } from '../../services/polkadot';
import { getFinalized } from '../../services/polkascan';

const Subscription = {
  finalizedHead: {
    async subscribe(parent, args, { pubSub }, info) {
      getFinalized();
      return pubSub.asyncIterator('finalizedHeadChannel');
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
      getHeartbeats(api, pubSub);
      return pubSub.asyncIterator('heartsChannel');
    },
  },
};

export { Subscription as default };
