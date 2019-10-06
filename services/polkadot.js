import { hexToNumber } from '@polkadot/util';

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

const getHeartbeats = async (api, pubSub) => {
  try {
    const unsub = await api.derive.imOnline.receivedHeartbeats(result => {
      const heartbeat = JSON.stringify(result);
      console.log(heartbeat);
      pubSub.publish('heartsChannel', {
        heartbeats: 'beat',
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export { getSessionInfo, getHeartbeats };
