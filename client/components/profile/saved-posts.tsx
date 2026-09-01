import { getSavedPosts } from "@/helper/posts";
import PostCardImage from "../shared/post-card-image";

export default async function SavedPosts({ userId }: { userId: string }) {
  const savedPosts = await getSavedPosts(userId);
  return savedPosts.length > 0 ? (
    savedPosts?.map((post) => <PostCardImage post={post} key={post.post_id} />)
  ) : (
    <p className="w-full py-10 text-center text-sm text-white/50">
      No saved posts yet.
    </p>
  );
}
