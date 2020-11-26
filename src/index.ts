import Discord from 'discord.js';
const bot = new Discord.Client();
require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

let memberUnmute: any;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user?.tag}`);
});

bot.on('voiceStateUpdate', (oldState, newState) => {
  const oldChannel = oldState.channelID;
  const newChannel = newState.channelID;

  // if the user leaves a channel clear the setTimeout
  if (oldChannel !== newChannel && oldChannel !== null) {
    clearTimeout(memberUnmute);
  }

  if (
    // if the user joined a new channel
    (oldChannel === null && newChannel !== null) ||
    // the user switched channels
    (oldChannel !== newChannel && newChannel !== null)
  ) {
    // mute the member on voice join
    newState.member?.voice.setMute(true);
    // assign the variable to unmute
    memberUnmute = setTimeout(function () {
      oldState.member?.voice.setMute(false);
    }, 5000);
  }
});

bot.on('message', (msg: Discord.Message) => {
  if (msg.content === 'foo') msg.reply('`bar`');
});

bot.login(DISCORD_BOT_TOKEN);
