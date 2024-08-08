"use client";

import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Post } from "@/types";
import { shimmer, toBase64 } from "@/utils/image-loader";

const PostCard =dynamic(()=> import('../shared/post-card'), {ssr:false})


const RenderComponentBasedOnType = (type: string, post: Post) => {
  switch (type) {
    case "profile":
      return (
        <Link
          className="min-w-[400px] max-w-[400px]"
          href={`/post/${post?.post_id}`}
          key={post.post_id}
        >
          <Image
            className="aspect-square h-full max-h-[300px] w-full min-w-[300px] max-w-full rounded-lg border border-gray-600 object-cover object-center"
            sizes="400px"
            onError={(e) =>
              (e.currentTarget.src = "/assets/shared/images/placeholder.png")
            }
            src={post.media_url ?? "/assets/shared/images/placeholder.png"}
            priority={true}
            loading={"eager"}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
            width={500}
            height={500}
            alt="attachment"
          />
        </Link>
      );

    default:
      return (
        <PostCard
          fileId={post.media_asset_id}
          createdAt={post.createdat}
          authorId={post.author_id}
          likes={post.likes}
          priority={false}
          loading="lazy"
          postId={post?.post_id}
          key={post?.post_id}
          media={post?.media_url}
          authorImage={post?.profile_image}
          authorUsername={post?.author_name}
          captions={post?.captions}
        />
      );
  }
};

export default function LoadMore({
  prevPosts,
  type,
  totalPosts,
}: {
  prevPosts: Post[];
  type: string;
  totalPosts: number;
}) {
  const { ref, inView } = useInView();

  const [posts, setPosts] = useState<Post[]>([]);
  const [lastCursor, setLastCursor] = useState<string | undefined>(
    prevPosts[prevPosts.length - 1]?.post_id,
  );
  const [lastCreatedAt, setLastCreatedAt] = useState<string | undefined>(
    prevPosts[prevPosts.length - 1]?.createdat,
  );
  const [hasMorePosts, setHasMorePosts] = useState(
    prevPosts.length < totalPosts,
  );

  const setLastCursorSafe = (newCursor: string) => {
    if (newCursor !== lastCursor) {
      setLastCursor(newCursor);
    }
  };

  const setLastCreatedAtSafe = (newCreatedAt: string) => {
    if (newCreatedAt !== lastCreatedAt) {
      setLastCreatedAt(newCreatedAt);
    }
  };

  const getPosts = useCallback(async () => {
    if (!lastCursor || !lastCreatedAt) return;

    try {
      const { getAllPosts } = await import('@/helper/posts')
      const res = await getAllPosts(lastCursor, lastCreatedAt);

      setPosts((prev) => [...prev, ...res.posts]);

      if (res.posts.length > 0) {
        setLastCursorSafe(res.posts[res.posts.length - 1].post_id);
        setLastCreatedAtSafe(res.posts[res.posts.length - 1].createdat);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [lastCreatedAt, lastCursor]);

  useEffect(() => {
    if (inView && hasMorePosts && prevPosts.length >= 10) {
      getPosts();
    }
  }, [hasMorePosts, inView, prevPosts.length]);

  return (
    <>
      {posts?.map((post) => RenderComponentBasedOnType(type, post))}

      {hasMorePosts && (
        <div
          className="flex w-full min-w-[400px] items-center justify-center pt-5"
          ref={ref}
        >
          <div className="w-full animate-pulse space-y-3">
            <div className="h-40 w-full rounded-md bg-black-1"></div>
            <div className="h-5 w-full rounded-full bg-black-1"></div>
            <div className="h-4 w-[calc(100%-50px)] rounded-full bg-black-1"></div>
          </div>
        </div>
      )}
    </>
  );
}
