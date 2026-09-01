"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { publishPost } from "@/actions/post";

const fallbackErrorMessage = "Failed to publish post";

type Props = { postId: string };

export default function PublishPost({ postId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePublishPost = async () => {
    try {
      setIsLoading(true);
      const res = await publishPost(postId, window.location.pathname);
      if (res && "errors" in res) {
        toast.error(res.errors || fallbackErrorMessage);
        return;
      }
      toast.success("Post has been published");
    } catch (error) {
      toast.error((error as Error).message || fallbackErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePublishPost}
      aria-disabled={isLoading}
      title="publish"
      name="publish"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 py-3 text-center text-sm text-blue-500 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      Publish
    </button>
  );
}
