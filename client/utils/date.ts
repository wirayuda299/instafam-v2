import { formatDistanceToNowStrict } from "date-fns";

export const formatMessageTimestamp = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const diffInSeconds = (Date.now() - date.getTime()) / 1000;
  if (diffInSeconds < 60) return "just now";

  return formatDistanceToNowStrict(date, { addSuffix: true });
};
