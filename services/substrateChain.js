import { ApiPromise, WsProvider } from '@polkadot/api';

const connectToChain = async () => {
  const WS_PROVIDER = 'wss://kusama-rpc.polkadot.io/';
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

export { connectToChain };