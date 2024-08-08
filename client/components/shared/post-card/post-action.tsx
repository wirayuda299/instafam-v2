"use client";

import { useAuth } from "@clerk/nextjs";

import FollowButton from "./follow-button";
import DeletePost from "./delete-post";

type Props = { fileId: string; postAuthor: string; postId: string };

export default function PostAction({ postAuthor, postId, fileId }: Props) {
  const { userId } = useAuth();

  if (!userId) return null;

  return userId !== postAuthor ? (
    <FollowButton userToFollow={postAuthor} userId={userId} />
  ) : (
    <DeletePost postAuthor={postAuthor} fileId={fileId} postId={postId} />
  );
}
