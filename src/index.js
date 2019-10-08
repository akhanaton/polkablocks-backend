import '@babel/polyfill';
import { createServer } from './createServer';
import { getHeartbeats } from './services/polkascan';

const server = createServer();

server.start(
  {
    cors: {
      credentials: true,
      origin: '*',
    },
    port: process.env.PORT || 4000,
  },

  deets => {
    console.log(`Server is now running on port 
  http://localhost:${deets.port}`);
  }
);

getHeartbeats();
