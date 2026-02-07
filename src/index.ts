import fs from 'fs';
import { listen, createServer, getChannels } from './modules/discord';

if (fs.existsSync('./map.json')) {
  listen().catch((err) => {
    console.error('Error starting listener:', err.message);
    process.exit(1);
  });
} else {
  getChannels()
    .then((channels) => createServer(channels))
    .then(() => listen())
    .catch((err) => {
      console.error('Error during setup:', err.message);
      process.exit(1);
    });
}
