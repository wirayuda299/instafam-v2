"use client";

import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { Post } from "@/types";
import PostCard from "../shared/post-card";
import PostCardImage from "../shared/post-card-image";
import ExploreTile from "../shared/explore-tile";

const RenderComponentBasedOnType = (
  type: string,
  post: Post,
  index: number,
) => {
  switch (type) {
    case "profile":
      return <PostCardImage key={post.post_id} post={post} />;

    case "explore":
      return <ExploreTile key={post.post_id} post={post} index={index} />;

    default:
      return (
        <PostCard
          fileId={post.media_asset_id}
          created_at={post.created_at}
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
  prevPosts = [],
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
    prevPosts[prevPosts?.length - 1]?.post_id,
  );
  const [lastCreatedAt, setLastCreatedAt] = useState<string | undefined>(
    prevPosts[prevPosts?.length - 1]?.created_at,
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
      const { getAllPosts } = await import("@/helper/posts");
      const res = await getAllPosts(lastCursor, lastCreatedAt);

      setPosts((prev) => [...prev, ...res.posts]);

      if (res.posts.length > 0) {
        setLastCursorSafe(res?.posts[res.posts.length - 1].post_id);
        setLastCreatedAtSafe(res?.posts[res.posts.length - 1].created_at);
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
  }, [getPosts, hasMorePosts, inView, prevPosts.length]);

  return (
    <>
      {posts?.map((post, i) => RenderComponentBasedOnType(type, post, i))}

      {hasMorePosts && prevPosts.length >= 10 && (
        <div
          className="flex w-full min-w-[400px] items-center justify-center pt-5"
          ref={ref}
        >
          <div className="w-full animate-pulse space-y-3">
            <div className="bg-black-1 h-40 w-full rounded-md"></div>
            <div className="bg-black-1 h-5 w-full rounded-full"></div>
            <div className="bg-black-1 h-4 w-[calc(100%-50px)] rounded-full"></div>
          </div>
        </div>
      )}
    </>
  );
}
