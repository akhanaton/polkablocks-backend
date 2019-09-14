/* eslint-disable no-plusplus */

import { setAddressPrefix, encodeAddress } from '@polkadot/util-crypto';

setAddressPrefix(2);

const Subscription = {
  blockHeight: {
    async subscribe(parent, args, { api, pubsub }, info) {
      await api.rpc.chain.subscribeNewHeads(header => {
        pubsub.publish('blockHeightChannel', {
          blockHeight: header.number,
        });
      });

      return pubsub.asyncIterator('blockHeightChannel');
    },
  },
  sessionValidators: {
    subscribe(parent, args, { api, pubsub }, info) {
      (async function getSessionValidators() {
        const validatorArray = await api.query.session.validators();
        const validators = validatorArray.map(controllerId => ({
          controllerId: encodeAddress(controllerId),
        }));

        pubsub.publish('sessValChannel', {
          sessionValidators: validators,
        });

        setInterval(getSessionValidators, 60000);
      })();

      return pubsub.asyncIterator('sessValChannel');
    },
  },
  stakingValidators: {
    subscribe(parent, args, { api, pubsub }, info) {
      (async function getStakingValidators() {
        console.log('ran');
        const validatorMap = await api.query.staking.validators();
        const validators = [];
        for (let index = 0; index < validatorMap[0].length; index++) {
          validators.push({
            controllerId: encodeAddress(validatorMap[0][index]),
            ...validatorMap[1][index],
          });
        }

        pubsub.publish('stakeValChannel', {
          stakingValidators: validators,
        });

        setInterval(getStakingValidators, 60000);
      })();

      return pubsub.asyncIterator('stakeValChannel');
    },
  },
  stakers: {
    subscribe(parent, args, { api, pubsub }, info) {
      (async function getStakers() {
        const stakers = await api.query.staking.stakers(args.accountId);
        const totalStake = stakers.total.toString();
        const ownStake = stakers.own.toString();
        const rawNominators = stakers.toJSON().others;

        const nominators = rawNominators.map(nominator => ({
          accountId: encodeAddress(nominator.who),
          bond: nominator.value,
        }));

        pubsub.publish('stakersChannel', {
          stakers: { totalStake, ownStake, nominators },
        });

        setInterval(getStakers, 60000);
      })();

      return pubsub.asyncIterator('stakersChannel');
    },
  },
  authorship: {
    subscribe(parent, args, { api, pubsub }, info) {
      (async function getAuthorship(params) {
        const authorshipOption = await api.query.authorship.author();
        const author = authorshipOption.isSome
          ? authorshipOption.unwrap.toString()
          : 'Nil';

        console.log(author);

        pubsub.publish('authorChannel', {
          authorship: author,
        });

        setInterval(getAuthorship, 2000);
      })();

      return pubsub.asyncIterator('authorChannel');
    },
  },
  ledger: {
    subscribe(parents, args, { api, pubsub }, info) {
      (async function getLedger() {
        const ledgerOption = await api.query.staking.ledger(args.accountId);
        const ledger = ledgerOption.unwrap();
        const { stash, total, active } = ledger;
        console.log(stash);
        pubsub.publish('ledgerChannel', {
          ledger: {
            stash: encodeAddress(stash),
            total,
            active,
          },
        });

        setInterval(getLedger, 60000);
      })();

      return pubsub.asyncIterator('ledgerChannel');
    },
  },
  freeBalance: {
    subscribe(parents, args, { api, pubsub }, info) {
      (async function getFreeBalance(params) {
        const freeBalance = await api.query.balances.freeBalance(
          args.accountId
        );
        console.log(freeBalance.toString());
        pubsub.publish('ledgerChannel', {
          freeBalance: 'hello',
        });
        setInterval(getFreeBalance, 60000);
      })();
      return pubsub.asyncIterator('freeBalanceChannel');
    },
  },
  /* imOnline: {
    async subscribe(parent, args, { api, pubsub }, info) {
      await api.query.staking(events => {
        console.log(`\nReceived ${events.length} events:`);

        // loop through the Vec<EventRecord>
        events.forEach(record => {
          // extract the phase, event and the event types
          const {
            event: { data, method, section, typeDef, meta },
            phase,
          } = record;
          const types = typeDef;
          console.log(section);
          if (section === 'imOnline') {
            // show what we are busy with
            console.log(`\t${section}:${method}:: (phase=${phase.toString()})`);
            console.log(`\t\t${meta.documentation.toString()}`);

            // loop through each of the parameters, displaying the type and data
            data.forEach((data, index) => {
              console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
            });
          }
        });
      });
    },
  }, */
};

export { Subscription as default };
