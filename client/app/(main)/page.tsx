
import PostCard from "@/components/shared/post-card/index";
import Recommendations from "@/components/shared/recommendations/recommendations";
import { getAllPosts } from "@/helper/posts";
import LoadMorePost from "@/components/load-more/posts";

export const dynamic = 'force-dynamic'
export default async function Home() {
  const { posts, totalPosts } = await getAllPosts();

  return (
    <main className="no-scrollbar flex h-full" id="test">
      <div className="flex h-auto max-h-screen w-full flex-col gap-5 divide-y divide-gray-600/50 overflow-y-auto p-2 max-md:max-h-dvh">
        {posts?.map((post) => (
          <PostCard
            fileId={post?.media_asset_id}
            created_at={post?.created_at}
            authorId={post?.author_id}
            likes={post?.likes || []}
            priority={true}
            loading="eager"
            postId={post?.post_id}
            key={post?.post_id}
            media={post?.media_url}
            authorImage={post?.profile_image}
            authorUsername={post?.author_name}
            captions={post?.captions}
          />
        ))}
        <LoadMorePost totalPosts={totalPosts} prevPosts={posts} type="common" />
      </div>
      <Recommendations />
    </main>
  );
}
