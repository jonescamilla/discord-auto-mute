import Discord from 'discord.js';

let timeoutId: NodeJS.Timeout;
/**
 * Will auto mute members that join a voice channel for `time` amount
 * @param oldState Previous user VoiceState
 * @param newState Current user VoiceState
 * @param time the desired time a user should wait when joining a voice channel
 */
export const autoMute = (
  oldState: Discord.VoiceState,
  newState: Discord.VoiceState,
  time: number
): void => {
  const oldChannel = oldState.channelID;
  const newChannel = newState.channelID;

  // if the user leaves a channel clear the setTimeout
  if (oldChannel !== newChannel && oldChannel !== null) {
    clearTimeout(timeoutId);
  }

  if (
    // if the user joined a new channel
    (oldChannel === null && newChannel !== null) ||
    // the user switched channels
    (oldChannel !== newChannel &&
      newChannel !== null &&
      newState.channelID == '785293840298803241')
  ) {
    // mute the member on voice join
    newState.member?.voice.setMute(true);
    // assign the variable to unmute
    timeoutId = setTimeout(function () {
      oldState.member?.voice.setMute(false);
    }, time);
  }
};
