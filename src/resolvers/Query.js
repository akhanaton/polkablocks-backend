/* eslint-disable camelcase */
import { setSS58Format, encodeAddress } from '@polkadot/util-crypto';
import { hexToString } from '@polkadot/util';

setSS58Format(2);
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
  async sessionValidators(parent, args, { api }, info) {
    const validatorArray = await api.query.session.validators();
    const validators = validatorArray.map(controllerId => ({
      controllerId: encodeAddress(controllerId),
    }));
    return validators;
  },
  async authorship(parent, args, { api }, info) {
    const authorshipOption = await api.query.authorship.author();
    const author = authorshipOption.isSome
      ? authorshipOption.unwrap.toString()
      : 'Nil';
    return author;
  },
  async stakers(parents, args, { api }, info) {
    const stakers = await api.query.staking.stakers(args.accountId);
    const totalStake = stakers.total.toString();
    const ownStake = stakers.own.toString();
    const rawNominators = stakers.toJSON().others;

    const nominators = rawNominators.map(nominator => ({
      accountId: encodeAddress(nominator.who),
      bond: nominator.value,
    }));

    return nominators;
  },
  async ledger(parents, args, { api }, info) {
    const ledgerOption = await api.query.staking.ledger(args.accountId);
    const ledger = ledgerOption.unwrap();
    const { stash, total, active } = ledger;

    return {
      stash: encodeAddress(stash),
      total,
      active,
    };
  },

  async nick(parents, args, { api }, info) {
    let nick;
    try {
      const nickOption = await api.query.nicks.nameOf(args.accountId);
      const [head, ...tail] = nickOption.value;
      if (head) {
        nick = hexToString(head.toString());
      }
    } catch (error) {
      console.log(error);
    }
    return nick;
  },

  async freeBalance(parent, args, { api }, info) {
    const freeBalance = await api.query.balances.freeBalance(args.accountId);
    return freeBalance;
  },
  /* async stakingValidators(parent, args, { api }, info) {
    const validatorMap = await api.query.staking.validators();
    const validators = [];
    for (let index = 0; index < validatorMap[0].length; index++) {
      let activeBonded = 0;
      let totalBonded = 0;

      const bondedOption = await api.query.staking.bonded(
        encodeAddress(validatorMap[0][index])
      );

      const stashAccount = bondedOption.unwrapOr(null);

      if (stashAccount !== null) {
        const ledgerOption = await api.query.staking.ledger(
          encodeAddress(stashAccount)
        );
        const ledger = ledgerOption.unwrapOr('nil');
        const { stash, total, active } = ledger;

        const balance = await api.query.balances.freeBalance(
          encodeAddress(validatorMap[0][index])
        );

        const freeBalance = isHex(balance.toString())
          ? parseInt(balance.toString())
          : balance.toString();

        if (active) {
          activeBonded = isHex(active.toString())
            ? parseInt(active.toString())
            : active.toString();

          totalBonded = isHex(total.toString())
            ? parseInt(total.toString())
            : total.toString();
        }

        validators.push({
          controllerId: encodeAddress(validatorMap[0][index]),
          accountId: encodeAddress(stashAccount),
          totalBonded,
          activeBonded,
          freeBalance,
          ...validatorMap[1][index],
        });
      }
    }
    return validators;
  }, */

  async stakingValidators(parents, args, { api, client }, info) {
    const data = await client.getAsync('StakingValidators');
    const validators = JSON.parse(data);
    return validators;
  },

  async phragmenValidators(parents, args, { api, client }, info) {
    const data = await client.getAsync('PhragmenValidators');
    const validators = JSON.parse(data);
    const {
      validator_count,
      nominator_count,
      total_issuance,
      candidates,
      final_slot_stake,
    } = validators;

    const valCandidates = candidates.map(candidate => {
      const nominators = candidate.voters.map(voter => ({
        accountId: encodeAddress(voter.pub_key_nominator),
        stake: voter.stake_nominator,
      }));
      return {
        rank: candidate.rank,
        accountId: encodeAddress(candidate.pub_key_stash),
        totalStake: candidate.stake_total,
        validatorStake: candidate.stake_validator,
        nominatorStake: candidate.other_stake_sum,
        nominatorCount: candidate.other_stake_count,
        controllerId: encodeAddress(candidate.pub_key_controller),
        nominators,
      };
    });
    return {
      validatorCount: validator_count,
      nominatorCount: nominator_count,
      totalIssuance: total_issuance,
      lowestStake: final_slot_stake,
      valCandidates,
    };
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

  /*   async stakers(parent, args, { api }, info) {
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
  }, */
  async recievedHeartbeats(parents, args, { api }, info) {
    const result = await api.query.imOnline.receivedHeartbeats(
      args.sessionIndex,
      args.validatorId
    );

    return null;
  },
  async bonded(parents, args, { api }, info) {
    const result = await api.query.staking.bonded(args.controllerId);

    return null;
  },
  async currentIndex(parents, args, { api }, info) {
    const result = await api.query.session.currentIndex();
    return result.toString();
  },
};

export { Query as default };
