import { pubSub } from '../src/createServer';

const axios = require('axios');

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

module.exports = { getFinalized };
