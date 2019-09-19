import { setAddressPrefix, encodeAddress } from '@polkadot/util-crypto';

// setAddressPrefix(2);
/* eslint-disable no-plusplus */
const Query = {
  async currentElected(parent, args, { api }, info) {
    let validatorBalances;
    const elected = await api.query.staking.currentElected();
    if (elected && elected.length > 0) {
      // Retrieve the balances for all elected
      validatorBalances = await Promise.all(
        elected.map(accountId => api.query.balances.freeBalance(accountId))
      );
    }

    return elected.map((accountId, index) => ({
      accountId: encodeAddress(accountId),
      bond: validatorBalances[index].toString(),
    }));
  },

  async validatorCount(parents, args, { api }, info) {
    const count = await api.query.staking.validatorCount();

    return parseInt(count.toString());
  },
  async nominators(parents, args, { api }, info) {
    const result = await api.query.staking.nominators(args.accountId);
    console.log(JSON.stringify(result));
    console.log('**********************');
    const map = result.toJSON();
    console.log(map);
    return null;
  },
  async stakers(parent, args, { api }, info) {
    const stakers = await api.query.staking.stakers(args.accountId);
    const totalStake = stakers.total.toString();
    const ownStake = stakers.own.toString();

    const rawNominators = stakers.toJSON().others;

    const nominators = rawNominators.map(nominator => ({
      accountId: nominator.who,
      bond: nominator.value,
    }));

    return {
      totalStake,
      ownStake,
      nominators,
    };
  },
  async recievedHeartbeats(parents, args, { api }, info) {
    const result = await api.query.imOnline.receivedHeartbeats(
      args.sessionIndex,
      args.validatorId
    );

    console.log(JSON.stringify(result));

    return null;
  },
  async bonded(parents, args, { api }, info) {
    const result = await api.query.staking.bonded(args.controllerId);
    console.log(JSON.stringify(result));
    return null;
  },
  async currentIndex(parents, args, { api }, info) {
    const result = await api.query.session.currentIndex();
    return result.toString();
  },
};

export { Query as default };
