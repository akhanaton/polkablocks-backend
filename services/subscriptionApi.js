import { setAddressPrefix, encodeAddress } from '@polkadot/util-crypto';
import { isHex } from '../utils/numbers';
import { connectToChain } from './substrateChain';
import { pubSub } from '../src/createServer';

setAddressPrefix(2);

let api;

(async () => {
  api = await connectToChain();
})();

const getStakingValidators = () =>
  setInterval(async () => {
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

    pubSub.publish('stakeValChannel', {
      stakingValidators: validators,
    });
  }, [6000]);

const getNewHeads = () => {
  setTimeout(async () => {
    await api.rpc.chain.subscribeNewHeads(header => {
      pubSub.publish('blockHeightChannel', {
        blockHeight: header.number,
      });
    });
  }, [3000]);
};

const getSessionValidators = () => {
  setInterval(async () => {
    const validatorArray = await api.query.session.validators();
    const validators = validatorArray.map(controllerId => ({
      controllerId: encodeAddress(controllerId),
    }));

    pubSub.publish('sessValChannel', {
      sessionValidators: validators,
    });
  }, [3000]);
};

const getFreeBalance = () => {
  setInterval(async () => {
    const freeBalance = await api.query.balances.freeBalance(args.accountId);

    pubSub.publish('ledgerChannel', {
      freeBalance: 'hello',
    });
  }, [60000]);
};

const getStakers = () => {
  setInterval(async () => {
    const stakers = await api.query.staking.stakers(args.accountId);
    const totalStake = stakers.total.toString();
    const ownStake = stakers.own.toString();
    const rawNominators = stakers.toJSON().others;

    const nominators = rawNominators.map(nominator => ({
      accountId: encodeAddress(nominator.who),
      bond: nominator.value,
    }));

    pubSub.publish('stakersChannel', {
      stakers: { totalStake, ownStake, nominators },
    });
  }, [60000]);
};

const getAuthorship = () => {
  setInterval(async () => {
    const authorshipOption = await api.query.authorship.author();
    const author = authorshipOption.isSome
      ? authorshipOption.unwrap.toString()
      : 'Nil';

    pubSub.publish('authorChannel', {
      authorship: author,
    });
  }, [60000]);
};

const getLedger = () => {
  setInterval(async () => {
    const ledgerOption = await api.query.staking.ledger(args.accountId);
    const ledger = ledgerOption.unwrap();
    const { stash, total, active } = ledger;

    pubSub.publish('ledgerChannel', {
      ledger: {
        stash: encodeAddress(stash),
        total,
        active,
      },
    });
  }, [60000]);
};

export {
  getStakingValidators,
  getNewHeads,
  getSessionValidators,
  getFreeBalance,
  getStakers,
  getAuthorship,
  getLedger,
};
