"use client";

import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import useSwr from "swr";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

import { handleError } from "@/utils/error";
import { getSavedPosts } from "@/helper/posts";
import { cn } from "@/lib/utils";
import { saveOrDeleteBookmarkedPost } from "@/actions/post";

type Props = {
  postId: string | null;
  authorId: string;
};

export default function Bookmarks({ postId, authorId }: Props) {
  const { userId } = useAuth();

  const { data, isLoading, isValidating, mutate } = useSwr(
    userId ? `bookmarks/${userId}` : null,
    () => getSavedPosts(userId!),
    { fallbackData: [] },
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isSaved = useMemo(
    () => data.some((bookmark) => bookmark.post_id === postId),
    [data, postId],
  );

  const handleSaveOrDeletePost = async () => {
    if (!postId) return;

    try {
      mutate((prevData) => {
        if (isSaved) {
          return prevData?.filter((bookmark) => bookmark.post_id !== postId);
        } else {
          return [
            ...(prevData || []),
            { post_id: postId } as unknown as (typeof data)[number],
          ];
        }
      }, false);

      const res = await saveOrDeleteBookmarkedPost(postId);
      if (res && "errors" in res) {
        handleError(res, "Something wrong");
        mutate();
      } else {
        mutate();
      }
    } catch (error) {
      toast.error((error as Error).message || "Something wrong");
    }
  };
  if (!postId || userId === authorId) return null;

  return (
    <button
      data-testid="bookmark"
      aria-disabled={mounted && (isValidating || isLoading)}
      disabled={mounted && (isValidating || isLoading)}
      onClick={handleSaveOrDeletePost}
      className="group"
      title="bookmark"
      name="bookmark"
    >
      <Bookmark
        size={30}
        className={cn(
          "transition-[color,transform] duration-150 group-hover:text-gray-500 group-active:scale-90 disabled:cursor-not-allowed",
          isSaved ? "fill-white stroke-white" : "",
        )}
      />
    </button>
  );
}
