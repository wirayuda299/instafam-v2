"use client";

import { toast } from "sonner";
import useSWR from "swr";
import { useMemo, useState } from "react";

import { getUserFollowers, getUserFollowing } from "@/helper/users";
import { handleError } from "@/utils/error";
import { cn } from "@/lib/utils";

type Props = {
  userToFollow: string;
  userId: string;
  styles?: string;
};

export default function FollowButton({ userToFollow, userId, styles }: Props) {
  const [pending, setPending] = useState(false);

  const {
    data: followings,
    isLoading: followingLoading,
    error: followingError,
  } = useSWR(`/following/${userToFollow}`, () =>
    getUserFollowing(userToFollow),
  );
  const {
    data: followers,
    isLoading,
    error,
    mutate,
  } = useSWR(`followers/${userToFollow}`, () => getUserFollowers(userToFollow));

  const isFollowing = useMemo(
    () => followers?.find((follower) => follower.follower_id === userId),
    [followers, userId],
  );

  const isFollowCurrentUser = useMemo(
    () => followings?.map((foll) => foll.following_id).includes(userId),
    [followings, userId],
  );

  if (error || followingLoading || followingError || isLoading) return null;

  const handleFollowUnfollow = async () => {
    try {
      setPending(true);

      mutate((prevData) => {
        if (isFollowing) {
          return (
            prevData?.filter((follower) => follower.follower_id !== userId) ||
            []
          );
        } else {
          return [...(prevData || []), { follower_id: userId! }];
        }
      }, false);

      const {followUnfollow}= await import( "@/actions/users")
      const res = await followUnfollow(userId, userToFollow);
      if (res && "errors" in res) {
        handleError(res, "Failed to follow or unfollow user");
        return;
      }
      mutate();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      title={isFollowing ? "unfollow" : "follow"}
      name={isFollowing ? "unfollow" : "follow"}
      disabled={pending}
      onClick={handleFollowUnfollow}
      className={cn(
        "flex w-full min-w-fit cursor-pointer items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm disabled:cursor-not-allowed",
        styles,
      )}
    >
      {isFollowing
        ? "Unfollow"
        : isFollowCurrentUser
          ? "Follow back"
          : "Follow"}
    </button>
  );
}
