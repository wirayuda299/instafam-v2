"use client";

import { toast } from "sonner";
import useSWR from "swr";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { getFollowStatus } from "@/helper/users";
import { handleError } from "@/utils/error";
import { cn } from "@/lib/utils";
import { followUnfollow } from "@/actions/users";

type Props = {
  userToFollow: string;
  userId: string;
  styles?: string;
};

export default function FollowButton({ userToFollow, userId, styles }: Props) {
  const [pending, setPending] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    `follow-status/${userId}/${userToFollow}`,
    () => getFollowStatus(userId, userToFollow),
  );

  const isFollowing = data?.is_following;
  const isFollowCurrentUser = data?.is_follower;

  if (error || isLoading) return null;

  const handleFollowUnfollow = async () => {
    try {
      setPending(true);

      mutate(
        (prev) =>
          prev && { ...prev, is_following: !prev.is_following },
        false,
      );

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
        "flex w-full min-w-fit cursor-pointer items-center justify-center gap-2 py-3 text-center text-sm text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50",
        styles,
      )}
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      {isFollowing
        ? "Unfollow"
        : isFollowCurrentUser
          ? "Follow back"
          : "Follow"}
    </button>
  );
}
