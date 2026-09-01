import { auth } from "@clerk/nextjs/server";

import { getAllPosts } from "@/helper/posts";
import LoadMore from "@/components/load-more/posts";
import ExploreTile from "@/components/shared/explore-tile";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
    <div className="grid max-h-screen min-h-screen w-full grid-cols-2 content-start gap-0.5 overflow-y-auto md:grid-cols-3">
      {posts.map((post, i) => (
        <ExploreTile key={post.post_id} post={post} index={i} priority />
      ))}

      <LoadMore totalPosts={totalPosts} type="explore" prevPosts={posts} />
    </div>
  );
}
