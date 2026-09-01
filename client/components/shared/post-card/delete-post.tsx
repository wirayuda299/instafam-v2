"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { deletePost } from "@/actions/post";

const fallbackErrorMessage = "Failed to delete post";

type Props = { fileId: string; postId: string; postAuthor: string };

export default function DeletePost({ fileId, postId, postAuthor }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDeletePost = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    try {
      setIsLoading(true);
      await deletePost(fileId, postId, postAuthor, window.location.pathname);

      toast.success("Post successfully deleted");
    } catch (error) {
      if ((error as Error).message !== "NEXT_REDIRECT") {
        toast.error((error as Error).message || fallbackErrorMessage);
      }
    } finally {
      setIsLoading(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDeletePost}
      onBlur={() => setConfirming(false)}
      aria-disabled={isLoading}
      title="delete"
      name="delete"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 py-3 text-center text-sm text-red-500 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {confirming ? "Confirm delete?" : "Delete"}
    </button>
  );
}
