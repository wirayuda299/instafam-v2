"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { Heart } from "lucide-react";

import { Comment } from "@/types";
import { shimmer, toBase64 } from "@/utils/image-loader";

export default function LoadMoreComments({
  cursor,
  createdAt,
  postId,
  prevComments,
}: {
  cursor: string;
  createdAt: string;
  postId: string;
  prevComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [lastCursor, setLastCursor] = useState<string | undefined>(cursor);
  const [lastCreatedAt, setLastCreatedAt] = useState<string | undefined>(
    createdAt,
  );
  const [hasMoreComments, sethasMoreComments] = useState(true);
  const { ref, inView } = useInView();

  const getComments = useCallback(async () => {
    try {
      const { getAllComments } = await import('@/helper/comments')
      const res = await getAllComments(postId, lastCursor, lastCreatedAt);

      setComments((prev) => prev.concat(res));

      if (res.length > 0) {
        setLastCursor(res[res.length - 1].post_id);
        setLastCreatedAt(res[res.length - 1].createdat);
      } else {
        sethasMoreComments(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [lastCreatedAt, lastCursor, postId]);

  useEffect(() => {
    if (inView && prevComments.length >= 10 && hasMoreComments) {
      getComments();
    }
  }, [hasMoreComments, inView, prevComments.length]);

  return (
    <>
      {comments?.map((comment) => (
        <div
          key={comment.comment_id}
          className="flex w-full justify-between gap-2 rounded-md p-1 hover:bg-black-1/50"
        >
          <div className="flex gap-2">
            <Image
              loading="lazy"
              placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(50, 50))}`}
              className="aspect-auto size-12 min-w-12 rounded-full object-cover"
              src={comment.profile_image}
              width={45}
              height={45}
              alt="profile"
            />
            <div>
              <div className="flex flex-wrap gap-2">
                <h3 className="text-sm font-semibold">{comment.username}</h3>
                <div>
                  <p className="text-xs">{comment.comment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs text-gray-500">
                <p>1m</p>
                <p>5 like</p>
              </div>
            </div>
          </div>
          <button title="like" name="like">
            <Heart size={15} />
          </button>
        </div>
      ))}
      {hasMoreComments && prevComments.length >= 10 && (
        <div className="flex w-full animate-pulse gap-3" ref={ref}>
          <div className="size-14 min-w-14 rounded-full bg-black-1"></div>
          <div className="w-full space-y-3">
            <div className="h-6 w-full rounded-md bg-black-1"></div>
            <div className="h-5 w-full max-w-[calc(100%-200px)] rounded-md bg-black-1"></div>
          </div>
        </div>
      )}
    </>
  );
}
