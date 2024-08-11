import LoadMore from "../load-more/posts";
import PostCardImage from "../shared/post-card-image";
import { Post } from "@/types";

export default function UserPosts({ posts, totalPosts }: { posts: Post[], totalPosts: number }) {

  return (
    <>
      {posts?.map((post) => (
        <PostCardImage key={post.post_id} post={post} />
      ))}

      <LoadMore
        totalPosts={totalPosts}
        type="profile"
        prevPosts={posts}
      />
    </>
  )

}
