import axios from 'axios';
import { pubSub } from '../createServer';

const getInitialHead = async () => {
  const res = await axios.get(`${process.env.POLKASCAN_API}/block`);
  const [head, ...tail] = res.data.data;
  return head.id;
};

const getFinalized = async () => {
  const height = await getInitialHead();
  pubSub.publish('finalizedHeadChannel', { finalizedHead: height });
  setInterval(async () => {
    const response = await axios.get(`${process.env.POLKASCAN_API}/block`);
    const [head, ...tail] = response.data.data;
    pubSub.publish('finalizedHeadChannel', { finalizedHead: head.id });
  }, 10000);
};

const currentSession = async () => {
  const sessions = await axios.get(
    `${process.env.POLKASCAN_API}/session/session`
  );
  const recentSession = sessions.data.data.find(el => el.type === 'session');
  return recentSession;
};

const heartbeats = async () => {
  const events = await axios.get(`${process.env.POLKASCAN_API}/event`);
  const recentSession = await currentSession();
  const startBlock = recentSession.attributes.created_at_block;
  const currentBeats = events.data.data.filter(event => {
    if (
      event.attributes.event_id === 'HeartbeatReceived' &&
      event.attributes.block_id > startBlock
    ) {
      return true;
    }
    return false;
  });
  const imOnline = currentBeats.map(el => el.attributes.attributes[0].value);
  return imOnline;
};

const getHeartbeats = async () => {
  const currentHeartbeats = await heartbeats();
  pubSub.publish('heartsChannel', {
    heartbeats: currentHeartbeats,
  });
  setInterval(async () => {
    const newHeartbeats = await heartbeats();
    pubSub.publish('heartsChannel', {
      heartbeats: newHeartbeats,
    });
  }, 60000);
};

module.exports = { getFinalized, getHeartbeats };
