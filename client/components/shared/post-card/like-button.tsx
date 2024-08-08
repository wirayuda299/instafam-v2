"use client";

import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { likeOrDislikePost } from "@/actions/post";
import { Like } from "@/types";
import { handleError } from "@/utils/error";

export default function LikeButton({
  postId,
  likes,
}: {
  postId: string;
  likes: Like[];
}) {
  const { userId } = useAuth();
  const pathname = usePathname();
  const [likesData, setLikesData] = useOptimistic(likes);
  const [pending, startTransition] = useTransition();

  const isLiked = useMemo(
    () => likesData.map((like) => like.liked_by).includes(userId!),
    [likesData, userId],
  );
  const handleLikes = async () => {
    try {
      startTransition(() => {
        setLikesData((prev) => {
          if (isLiked) {
            return prev.filter((like) => like.liked_by !== userId);
          } else {
            return prev.concat([{ liked_by: userId!, postId }]);
          }
        });
      });
      const res = await likeOrDislikePost(postId, pathname);
      if (res && "errors" in res) {
        handleError(res, "Something wrong when like or dislike post");
      }
    } catch (error: any) {
      toast.error(error.message || "Something wrong when like or dislike post");
    }
  };

  return (
    <button
      aria-disabled={pending}
      disabled={pending}
      onClick={handleLikes}
      title="like"
      name="like"
      className="group disabled:cursor-not-allowed"
    >
      <Heart
        size={30}
        className={cn(
          "group-hover:text-gray-500",
          isLiked ? "fill-red-600 stroke-red-600" : "",
        )}
      />
    </button>
  );
}
