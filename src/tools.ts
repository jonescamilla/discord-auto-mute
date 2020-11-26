import Discord from 'discord.js';

export const botLog = (data: any, msg: string) => {
  // find bot channel
  const botChannel = data.guild.channels.cache.find(
    (ch: Discord.GuildChannel) => ch.name === 'auto-mute'
  );
  // if channel is not found
  if (!botChannel) return;
  botChannel.send(msg);
};
