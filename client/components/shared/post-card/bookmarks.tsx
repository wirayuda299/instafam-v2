"use client";

import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import useSwr from "swr";
import { useAuth } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { handleError } from "@/utils/error";
import { getSavedPosts } from "@/helper/posts";
import { cn } from "@/lib/utils";

export default function Bookmarks({ postId }: { postId: string | null }) {
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
			const {saveOrDeleteBookmarkedPost}= await import('@/actions/post')

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
  if (!postId) return null;

  return (
    <button
      data-testid="bookmark"
      aria-disabled={isValidating || isLoading}
      disabled={isValidating || isLoading}
      onClick={handleSaveOrDeletePost}
      className="group"
      title="bookmark"
      name="bookmark"
    >
      <Bookmark
        size={30}
        className={cn(
          "disabled:cursor-not-allowed group-hover:text-gray-500",
          isSaved ? "fill-white stroke-white" : "",
        )}
      />
    </button>
  );
}
