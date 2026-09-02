import { auth } from "@clerk/nextjs/server";

import { getAllPosts } from "@/helper/posts";
import LoadMore from "@/components/load-more/posts";
import ExploreTile from "@/components/shared/explore-tile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore ",
};

export default async function Explore() {
  await auth.protect();
  const { posts, totalPosts } = await getAllPosts();

  if (posts.length < 1) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-2 text-center">
        <p className="prose prose-lg font-semibold text-white">
          No posts to explore yet
        </p>
        <p className="text-sm text-white/50">
          Check back once people start posting.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-3.5rem)] w-full overflow-y-auto p-1 md:h-screen md:p-2">
      <div className="columns-2 gap-1 sm:columns-3 md:gap-2 lg:columns-4 xl:columns-5">
        {posts.map((post, i) => (
          <ExploreTile
            key={post.post_id}
            post={post}
            index={i}
            priority={i < 8}
          />
        ))}

        <LoadMore totalPosts={totalPosts} type="explore" prevPosts={posts} />
      </div>
    </div>
  );
}
