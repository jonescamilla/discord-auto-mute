import Discord from 'discord.js';
/**
 * Will send `messageText` to `desiredChannel` on discord
 * @param data Discord Obj
 * @param desiredChannel the channel that you want `messageText` to be displayed in
 * @param messageText the message that will be displayed
 */
export const displayMessage = (
  data: any,
  desiredChannel: string,
  messageText: string
) => {
  // find desired channel
  const channel = data.guild.channels.cache.find(
    (ch: Discord.GuildChannel) => ch.name === desiredChannel
  );
  // if channel is not found
  if (!channel) return;
  return channel.send(messageText);
};
