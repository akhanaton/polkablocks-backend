import { createServer } from './createServer';
import {
  getStakingValidators,
  getSessionValidators,
} from '../services/subscriptionApi';

const server = createServer();

server.start(
  {
    cors: {
      credentials: true,
      origin: '*',
    },
  },

  deets => {
    console.log(`Server is now running on port 
  http://localhost:${deets.port}`);
  }
);

getStakingValidators();
getSessionValidators();
