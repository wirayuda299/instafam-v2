"use client";

import { useAuth } from "@clerk/nextjs";

import FollowButton from "./follow-button";
import DeletePost from "./delete-post";
import PublishPost from "./publish-post";
import EditCaption from "./edit-caption";

type Props = {
  fileId: string;
  postAuthor: string;
  postId: string;
  captions: string;
  published?: boolean;
};

export default function PostAction({
  postAuthor,
  postId,
  fileId,
  captions,
  published = true,
}: Props) {
  const { userId } = useAuth();

  if (!userId) return null;

  if (userId !== postAuthor) {
    return <FollowButton userToFollow={postAuthor} userId={userId} />;
  }

  return (
    <>
      {!published && <PublishPost postId={postId} />}
      <EditCaption postId={postId} captions={captions} />
      <DeletePost postAuthor={postAuthor} fileId={fileId} postId={postId} />
    </>
  );
}
