import {
  GuildEmoji,
  GuildMember,
  Message,
  Role,
  TextChannel,
} from 'discord.js';
import { rankings } from './variables';
const { rank_500, rank_400, rank_300, rank_200, rank_100 } = rankings;

/**
 * Will send `messageText` to `desiredChannel` on discord
 * @param data Discord Obj
 * @param desiredChannel the channel that you want `messageText` to be displayed in
 * @param messageText the message that will be displayed
 */
export const displayMessage = async (
  data: Message,
  desiredChannel: string,
  messageText: string
) => {
  // find desired channel
  const channel = data.guild?.channels.cache.find(
    (ch) => ch.name === desiredChannel
  );
  // if channel is not found
  if (!channel) return;
  return (channel as TextChannel).send(messageText);
};

/**
 * parse message text to return message w/out `<@`, `>`, `!`
 * @param message user message
 */
export const messageParser = (message: string, prefix: string): string => {
  message = message.slice(2, -1);

  if (message.startsWith(prefix)) {
    message = message.slice(1);
  }

  return message;
};

/**
 * Will return obj of the role passed in `desiredRole` by traversing through `data` passed
 * @param data obj from Discord
 * @param desiredRole the string of the
 */
export const findRole = (
  data: Message,
  desiredRole: string
): Role | undefined => {
  return data.guild?.roles.cache.find((role) => role.name === desiredRole);
};

/**
 * Will return the GuildEmoji of `desiredEmoji` or an empty string if undefined
 * @param data Discord obj
 * @param desiredEmoji the emoji name that want to search for
 * @returns GuildEmoji || empty string
 */
export const findGuildEmoji = (
  data: Message,
  desiredEmoji: string
): GuildEmoji | string => {
  // NEEDS IMPROVEMENT
  return (
    data.guild?.emojis.cache.find((emoji) => emoji.name === desiredEmoji) || ''
  );
};

/**
 * Will validate a single rank of an Entity Member
 * @param data `Discord` obj
 * @param user `Discord.User` obj
 * @param rankTag the rank's tag or name that you are looking to validate
 * @returns returns role object or null if the user does not have `rankTag` role
 */
export const singleRoleValidation = (
  data: Message,
  user: GuildMember,
  rankTag: string
) => {
  // traverse through data to find the role based on the name passed as `rankTag`
  const role = findRole(data, rankTag);
  if (user?.roles.cache.has(role?.id || '')) return role;
  else return null;
};

/**
 * Will remove a role and add a different role
 * @param data Discord Obj
 * @param member the member that you wish to manipulate ranks of
 * @param oldRole the name of role you wish to remove
 * @param newRole the name of role you wish to add
 */
export const replaceRole = (
  data: Message,
  member: GuildMember | undefined,
  oldRole: string,
  newRole: string
) => {
  // NEEDS IMPROVEMENT
  member?.roles.remove(findRole(data, oldRole) || '');
  // NEEDS IMPROVEMENT
  member?.roles.add(findRole(data, newRole) || '');
  return `${member} is now ${newRole}`;
};

/**
 * Will return role obj based on roles found on `user` arg
 * @param data the `Discord` obj
 * @param user either `Discord.GuildMember` or `Discord.User` obj
 * @returns `Rank` obj or response string
 */
export const getUserEntityRank = (
  data: Message,
  user: GuildMember | null | undefined
) => {
  //grab user's role starting from newbie up to council
  //having multiple roles would only accept the lower role since this is wrong anyway
  const council = findRole(data, rank_500);
  // let nominatedToCouncil = findRole(message, rank_490);
  const senior = findRole(data, rank_400);
  // let nominatedToSenior = findRole(message, rank_390);
  const member = findRole(data, rank_300);
  const trusted = findRole(data, rank_200);
  const newbie = findRole(data, rank_100);

  if (newbie ? user?.roles.cache.has(newbie.id) : false) {
    return newbie;
  } else if (trusted ? user?.roles.cache.has(trusted.id) : false) {
    return trusted;
  } else if (member ? user?.roles.cache.has(member.id) : false) {
    return member;
    // } else if (nominatedToSenior ? user.roles.cache.has(nominatedToSenior.id) : false) {
    // return nominatedToSenior;
  } else if (senior ? user?.roles.cache.has(senior.id) : false) {
    return senior;
    // } else if (nominatedToCouncil ? user.roles.cache.has(nominatedToCouncil?.id) : false) {
    // return nominatedToCouncil;
  } else if (council ? user?.roles.cache.has(council.id) : false) {
    return council;
  } else {
    return null;
  }
};
