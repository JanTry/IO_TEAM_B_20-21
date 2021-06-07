import {
  FaThumbsUp,
  FaThumbsDown,
  FaDeaf,
  FaLowVision,
  FaHandPaper,
  FaHandshake,
  FaQuestionCircle,
} from 'react-icons/fa';

export const getReactions = (reactionsData: { [reactionId: string]: { [id: string]: any } }, userId: string | null) => {
  const now = new Date();
  const timeAgo = (dateString: string) => (now as any) - Date.parse(dateString);
  const expiryTime = parseInt(process.env.REACT_APP_REACTION_EXPIRY_TIME as string, 10);
  const getReaction = (reactionId: string, usersDates: { [id: string]: any }) => {
    const freshReactions = Object.entries(usersDates).filter(([id, date]) => timeAgo(date) < expiryTime);
    const users =  freshReactions.map(([id, date]) => id)
    const isBlocked = userId && usersDates[userId] && timeAgo(usersDates[userId]) < expiryTime;
    return { "count": freshReactions.length, "isBlocked": isBlocked, "users": users };
  };
  return Object.fromEntries(Object.entries(reactionsData).map(([k, v]) => [k, getReaction(k, v)]));
};

export interface Reaction {
  count: number;
  isBlocked: Boolean;
  users: string[];
}

export interface ReactionObject {
  [reactionId: number]: Reaction;
}

export const reactionUsers = (reactions: ReactionObject, reactionId: number) => {
  const users = reactions[reactionId] ? reactions[reactionId].users : [];
  return users.length > 0 ? users.join("\n") : "...";
}


export const reactionIcons = [
  <FaThumbsUp />,
  <FaThumbsDown />,
  <FaHandPaper />,
  <FaHandshake />,
  <FaQuestionCircle />,
  <FaDeaf />,
  <FaLowVision />,
];

export default getReactions;
