import fs from 'fs';
import { discordToken, serverId } from './util/env';

// Validate environment before starting
if (!discordToken || !serverId) {
  console.warn('Discord Mirror: Missing DISCORD_TOKEN or SERVER_ID. Bot will not start.');
  console.warn('Set these environment variables and restart to run the bot.');
} else {
  // Dynamic import to avoid crashing when env vars are missing
  import('./modules/discord').then(({ listen, createServer, getChannels }) => {
    if (fs.existsSync('./map.json')) {
      listen().catch((err: Error) => {
        console.error('Error starting listener:', err.message);
      });
    } else {
      getChannels()
        .then((channels) => createServer(channels))
        .then(() => listen())
        .catch((err: Error) => {
          console.error('Error during setup:', err.message);
        });
    }
  });
}
