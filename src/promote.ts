// helper utils
import { Message, GuildMember } from 'discord.js';
import { getUserEntityRank, replaceRole } from './utils';
// variables
import { rankings } from './variables';
const { rank_500, rank_400, rank_300, rank_200, rank_100 } = rankings;

/**
 * Handles logic for promotions based on promoter and promotee rankings
 * @returns response string
 */
export const promote = (
  message: Message,
  promoter: GuildMember | undefined,
  promotee: GuildMember | undefined
) => {
  const promoterRankName = getUserEntityRank(message, promoter)?.name;
  const promoteeRankName = getUserEntityRank(message, promotee)?.name;

  //check user has permission to use command
  //if promoter is not Senior Member or Council, they cannot promote.
  if (
    promoterRankName === rank_100 ||
    promoterRankName === rank_200 ||
    promoterRankName === rank_300
  ) {
    return 'You are not authorized to promote anyone.';
  }
  //if promotee is Newbie or Farmer, AND promoter is senior or member they can be promoted.
  else if (
    (promoterRankName === rank_400 || promoterRankName === rank_500) &&
    promoteeRankName === rank_100
  ) {
    if (promoteeRankName === rank_100) {
      replaceRole(message, promotee, rank_100, promoteeRankName);
      return `Congratulations ${promotee?.displayName}!! You've been promoted to Trusted!!`;
    }
  }
  //if promoter is Council AND promotee is Trusted, they can be promoted to member.
  else if (promoterRankName === rank_500 && promoteeRankName === rank_200) {
    replaceRole(message, promotee, rank_200, promoteeRankName);
    return `Congratulations ${promotee?.displayName}!! You've been promoted to Member!!!`;
  } else if (promoterRankName === rank_400 && promoteeRankName === rank_200) {
    return 'Only Councils can promote Trusteds.';
  } else {
    return "You can't do that.";
  }
  return 'something happened';
};
