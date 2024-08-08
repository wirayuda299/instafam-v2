"use client";

import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { toast } from "sonner";

import { Comment } from "@/types";
import { likeOrDislikeComment } from "@/actions/comments";
import { handleError } from "@/utils/error";

export default function CommentLikeButton({
  likes,
  commentId,
}: {
  likes: Comment["likes"];
  commentId: string;
}) {
  const { userId } = useAuth();

  const pathname = usePathname();
  const isLiked = useMemo(
    () => likes.map((like) => like.liked_by).includes(userId!),
    [likes, userId],
  );

  const handleLikeOrDislikeComment = async () => {
    try {
      const res = await likeOrDislikeComment(commentId, pathname);
      if (res && "errors" in res) {
        handleError(res, "Failed to like or dislike comment");
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to like or dislike comment",
      );
    }
  };

  return (
    <button onClick={handleLikeOrDislikeComment} title="like" name="like">
      <Heart
        size={15}
        className={isLiked ? "fill-red-600 stroke-red-600" : ""}
      />
    </button>
  );
}
