import { hexToNumber } from '@polkadot/util';

const getInitialHead = async api => {
  const header = await api.rpc.chain.getHeader();
  return header.number;
};

const getSessionInfo = async (api, pubSub) => {
  try {
    await api.derive.session.info(result => {
      const sessionInfo = JSON.stringify(result);
      const res = JSON.parse(sessionInfo.toString());
      pubSub.publish('sessionChannel', {
        sessionInfo: {
          currentIndex: res.currentIndex,
          eraLength: hexToNumber(res.eraLength),
          eraProgress: hexToNumber(res.eraProgress),
          sessionProgress: hexToNumber(res.sessionProgress),
          sessionLength: res.sessionLength,
          sessionsPerEra: hexToNumber(res.sessionsPerEra),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const getHead = async (api, pubSub) => {
  try {
    const bestHead = await getInitialHead(api);
    pubSub.publish('headChannel', { bestHead });
    await api.rpc.chain.subscribeNewHeads(lastHeader => {
      pubSub.publish('headChannel', { bestHead: lastHeader.number });
    });
  } catch (error) {
    console.log(error);
  }
};

export { getSessionInfo, getHead };
