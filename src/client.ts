import Discord from 'discord.js';
import { autoMute } from './autoMute';
const client = new Discord.Client();
require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  autoMute(oldState, newState, 3000);
});

client.login(DISCORD_BOT_TOKEN);
