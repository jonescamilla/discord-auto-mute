import { Message, GuildMember, Role } from 'discord.js';
// variables
import { rankings } from '../variables';
const { rank_500, rank_400, rank_300, rank_490, rank_390 } = rankings;
// helper utils
import {
  getUserEntityRank,
  findRole,
  findGuildEmoji,
  singleRoleValidation,
  displayMessage,
  replaceRole,
} from '../utils';

/**
 * Will nominate user by removing user's current role and adding new nominated role
 * @param {GuildMember} member the user that is to be nominated
 * @returns object holding response message and new Role
 */
const nominateMember = (
  data: Message,
  member: GuildMember | undefined
): {
  msg: string;
  currentRole: Role | undefined;
} => {
  // the current user's rank's name
  const currentMemberRankName = getUserEntityRank(data, member)?.name;
  // if the user is a Senior Member
  if (currentMemberRankName === rank_400) {
    // remove the senior rank the user had and add nominated rank
    replaceRole(data, member, rank_400, rank_490);
    return {
      msg: `${member} has been promoted to ${rank_490}`,
      currentRole: findRole(data, rank_490),
    };
  }
  if (currentMemberRankName === rank_300) {
    // remove the member rank the user has and add the nominated rank
    replaceRole(data, member, rank_300, rank_390);
    return {
      msg: `${member} has been ${rank_390}`,
      currentRole: findRole(data, rank_390),
    };
  }
  // NEEDS IMPROVEMENT
  return {
    msg: 'something happened',
    currentRole: undefined,
  };
};

/**
 * Handles logic for nomination of members based on promoter and promotee
 * @returns response string
 */
export const nominate = async (
  message: Message,
  promoter: GuildMember | undefined,
  promotee: GuildMember
) => {
  const promoterRankName = getUserEntityRank(message, promoter)?.name;
  const promoteeRankName = getUserEntityRank(message, promotee)?.name;

  if (
    // if member has role Nominated to Senior Member
    singleRoleValidation(message, promotee, rank_390) ||
    // or member has role Nominated to Council
    singleRoleValidation(message, promotee, rank_490)
  ) {
    return 'member already nominated';
  }

  if (
    // if council is promoting another council
    (promoterRankName === rank_500 && promoteeRankName === rank_500) ||
    // if senior is promoting another senior
    (promoterRankName === rank_400 && promoteeRankName === rank_400) ||
    // if senior is promoting a council
    (promoterRankName === rank_400 && promoteeRankName === rank_500)
  ) {
    return 'not a valid nomination';
  }

  if (
    // if a council member is promoting a senior to council
    (promoterRankName === rank_500 && promoteeRankName === rank_400) ||
    // if council || senior is promoting a member to senior member
    ((promoterRankName === rank_500 || promoterRankName === rank_400) &&
      promoteeRankName === rank_300)
  ) {
    const { msg, currentRole } = nominateMember(message, promotee);
    // display the message returned from nominateMember
    const nominatedMessage = await displayMessage(message, 'auto-mute', msg);
    const upVoteEmoji = findGuildEmoji(message, 'rhino');
    const downVoteEmoji = findGuildEmoji(message, 'fudge');
    await nominatedMessage
      ?.react(upVoteEmoji)
      .then(() => nominatedMessage.react(downVoteEmoji));

    // store council role obj
    const councilRole = findRole(message, 'Council');
    // NEEDS IMPROVEMENT
    const councilSize = councilRole?.members.size || 100;
    // value to hold the amount needed for successful nomination
    let requiredVotes: number;
    // variable to hold name of role to apply if successful nomination
    let newRole: string;
    switch (currentRole?.name) {
      case rank_490:
        // if moving to council you need 100%
        requiredVotes = councilSize;
        newRole = rank_500;
        break;
      case rank_390:
        // if moving to senior you need 50%
        requiredVotes = councilSize / 2;
        newRole = rank_400;
        break;
    }
    /** filter used in createReactionCollector */
    const reactionCollectorFilter = (
      reaction: { emoji: { name: string } },
      user: { id: string }
    ) => {
      if (
        // if the reaction is desired emoji
        reaction.emoji.name === 'rhino' &&
        // and reacted user is in council
        councilRole?.members.find((val) => val.id === user.id)
      )
        return true;
      else return false;
    };
    // initiate createReactionCollector to handle votes through reactions
    nominatedMessage
      ?.createReactionCollector(reactionCollectorFilter, {
        time: 15000,
      })
      // when there is a valid connection
      .on('collect', (reaction, user) =>
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`)
      )
      // when the collection ends run
      .on('end', (collected: { size: number }) => {
        console.log(`Collected ${collected.size} items`);
        if (collected.size >= requiredVotes) {
          return replaceRole(
            message,
            promotee,
            // NEEDS IMPROVEMENT
            currentRole?.name || '',
            newRole
          );
        } else {
          return replaceRole(
            message,
            promotee,
            // NEEDS IMPROVEMENT
            currentRole?.name || '',
            promoteeRankName
          );
        }
      });
  }
  return 'something happened';
};
