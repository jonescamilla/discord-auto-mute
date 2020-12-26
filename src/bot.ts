import Discord from 'discord.js';
import { autoMute } from './autoMute';
import { prefix } from './variables';
import { nominate } from './nominate';
import { promote } from './promote';
const client = new Discord.Client();
require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  autoMute(oldState, newState, 3000);
});

client.on('message', async (message) => {
  // Exit and stop if the prefix is not there or if user is a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  //handling arguments
  const args: string[] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift()?.toLowerCase();
  // handle the user object
  // const promoter = message.guild?.member(message.author.id);
  const promoter = message.guild?.members.cache.find(
    (user) => user.id === message.author.id
  );
  const promotee = message.guild?.members.cache.find(
    (user) => user.id === message.mentions.users.first()?.id
  );
  // if there is no promotee
  if (!promotee) return message.channel.send('Not a user.');
  //Commands
  switch (command) {
    case 'ping':
      message.channel.send('Pong!');
      break;
    case 'promote':
      message.channel.send(promote(message, promoter, promotee));
      break;
    case 'nominate':
      message.channel.send(await nominate(message, promoter, promotee));
      break;
  }
  return;
});

client.login(DISCORD_BOT_TOKEN);
