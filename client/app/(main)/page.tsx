import { auth } from "@clerk/nextjs/server";
import PostCard from "@/components/shared/post-card/index";
import Recommendations from "@/components/shared/recommendations/recommendations";
import { getAllPosts } from "@/helper/posts";
import LoadMorePost from "@/components/load-more/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  await auth.protect();
  const { posts = [], totalPosts } = await getAllPosts();

  return (
    <main className="no-scrollbar flex h-full" id="test">
      <div className="flex h-auto max-h-screen w-full flex-col gap-4 overflow-y-auto p-2 max-md:max-h-dvh">
        {posts.length < 1 ? (
          <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-2 text-center">
            <p className="prose prose-lg font-semibold text-white">
              No posts yet
            </p>
            <p className="text-sm text-white/50">
              Follow people or create your first post to see it here.
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                fileId={post.media_asset_id}
                created_at={post.created_at}
                authorId={post.author_id}
                likes={post.likes || []}
                priority={true}
                loading="eager"
                postId={post.post_id}
                media={post.media_url}
                authorImage={post.profile_image}
                authorUsername={post.author_name}
                captions={post.captions}
              />
            ))}
            <LoadMorePost
              totalPosts={totalPosts}
              prevPosts={posts}
              type="common"
            />
          </>
        )}
      </div>
      <Recommendations />
    </main>
  );
}
