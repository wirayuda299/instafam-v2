"use client";

import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import useSwr from "swr";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { handleError } from "@/utils/error";
import { getSavedPosts } from "@/helper/posts";
import { cn } from "@/lib/utils";
import { saveOrDeleteBookmarkedPost } from "@/actions/post";

type Props = {
  postId: string | null;
  authorId: string;
};

export default function Bookmarks({ postId, authorId }: Props) {
  const pathname = usePathname();
  const { userId } = useAuth();

  const { data, isLoading, isValidating, mutate } = useSwr(
    "bookmarks",
    () => getSavedPosts(userId!),
    { fallbackData: [] },
  );

  const [bookmarks, setBookmarks] = useState(
    data.length > 0 ? data.map((bookmark) => bookmark.post_id) : [],
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isSaved = useMemo(
    () => bookmarks.includes(postId!),
    [bookmarks, postId],
  );

  const handleSaveOrDeletePost = async () => {
    if (!postId) return;

    try {
      setBookmarks((prevData) => {
        if (isSaved) {
          return prevData?.filter((post) => post !== postId);
        } else {
          return prevData?.concat(postId);
        }
      });

      const res = await saveOrDeleteBookmarkedPost(postId, pathname);
      if (res && "errors" in res) {
        handleError(res, "Something wrong");
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
