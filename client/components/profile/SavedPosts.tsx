import { getSavedPosts } from "@/helper/posts";
import PostCardImage from "../shared/post-card-image";

export default async function SavedPosts({ userId }: { userId: string }) {
  const savedPosts = await getSavedPosts(userId);
  return savedPosts.length > 0 ? (
    savedPosts?.map((post) => <PostCardImage post={post} key={post.post_id} />)
  ) : (
    <p>Nothing here</p>
  );
}
