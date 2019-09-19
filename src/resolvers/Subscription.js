/* eslint-disable no-plusplus */

import { setAddressPrefix, encodeAddress } from '@polkadot/util-crypto';
import { isHex } from '../../utils/numbers';

setAddressPrefix(2);

const Subscription = {
  blockHeight: {
    async subscribe(parent, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('blockHeightChannel');
    },
  },
  sessionValidators: {
    subscribe(parent, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('sessValChannel');
    },
  },
  stakingValidators: {
    subscribe(parent, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('stakeValChannel');
    },
  },
  stakers: {
    subscribe(parent, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('stakersChannel');
    },
  },
  authorship: {
    subscribe(parent, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('authorChannel');
    },
  },
  ledger: {
    subscribe(parents, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('ledgerChannel');
    },
  },
  freeBalance: {
    subscribe(parents, args, { api, pubSub }, info) {
      return pubSub.asyncIterator('freeBalanceChannel');
    },
  },
};

export { Subscription as default };
