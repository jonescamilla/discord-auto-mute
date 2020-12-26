import Discord from 'discord.js';
const client = new Discord.Client();
require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  autoMute(oldState, newState);
});

let memberUnmute: NodeJS.Timeout;

const autoMute = (
  oldState: Discord.VoiceState,
  newState: Discord.VoiceState
) => {
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
};

client.login(DISCORD_BOT_TOKEN);
