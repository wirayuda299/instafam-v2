import LoadMore from "../load-more/posts";
import PostCardImage from "../shared/post-card-image";
import { Post } from "@/types";

export default function UserPosts({
  posts,
  totalPosts,
}: {
  posts: Post[];
  totalPosts: number;
}) {
  if (posts.length < 1) {
    return (
      <p className="w-full py-10 text-center text-sm text-white/50">
        No posts yet.
      </p>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCardImage key={post.post_id} post={post} />
      ))}
      <LoadMore totalPosts={totalPosts} type="profile" prevPosts={posts} />
    </>
  );
}
