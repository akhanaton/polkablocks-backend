const polkadot = require('@polkadot/api');

const { ApiPromise, WsProvider } = polkadot;

const connectToChain = async () => {
  const WS_PROVIDER = 'ws://136.244.69.37:9944/';
  const provider = new WsProvider(WS_PROVIDER);

  const api = await ApiPromise.create({ provider });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);
  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  return api;
};

module.exports = { connectToChain };
