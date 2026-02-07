import * as dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN: discordToken, SERVER_ID: serverId } = process.env;

if (!discordToken) {
  console.warn('WARNING: DISCORD_TOKEN environment variable is not set. Bot authentication will fail.');
}
if (!serverId) {
  console.warn('WARNING: SERVER_ID environment variable is not set. Channel fetching will fail.');
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bot ${discordToken}`,
};

export {
  discordToken,
  serverId,
  headers,
};
