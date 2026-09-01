import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import PostCard from "@/components/shared/post-card";
import { blurDataURL } from "@/utils/image-loader";
import { getPostById } from "@/helper/posts";
import { getAllComments } from "@/helper/comments";
import LoadMoreComments from "@/components/load-more/comments";
import CommentItem from "@/components/shared/comment-item";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetail({ params }: Params) {
  const { userId } = await auth.protect();
  const id = (await params).id;
  const post = await getPostById(id, userId);
  if (!post) return notFound();

  const comments = await getAllComments(id);
  return (
    <div className="flex max-h-screen min-h-dvh w-full flex-col items-center justify-center overflow-y-auto px-3 py-3 max-lg:max-h-dvh lg:min-h-screen">
      <div className="flex h-full max-h-[600px] min-h-[510px] w-full max-w-(--breakpoint-lg) overflow-hidden rounded-xl border border-gray-800 bg-zinc-950 shadow-sm max-lg:max-h-full max-lg:flex-col">
        <Image
          className="aspect-auto max-h-[600px] w-full max-w-[450px] object-cover object-center max-lg:max-h-[300px] max-lg:max-w-full"
          src={post?.media_url}
          loading="lazy"
          placeholder={blurDataURL(500, 500)}
          width={500}
          height={500}
          alt="attachment"
        />
        <div className="relative w-full max-lg:max-h-[500px] max-lg:max-w-full">
          <PostCard
            fileId={post.media_asset_id}
            created_at={post.created_at}
            authorId={post.author_id}
            likes={post.likes || []}
            priority={true}
            loading="eager"
            postId={id}
            published={post.published}
            actionButtonStyles="border-t border-gray-800 pt-3"
            rootStyles="w-full h-full rounded-none border-none bg-transparent shadow-none"
            headerStyles="lg:sticky top-0 z-10 bg-zinc-950 border-b border-gray-800"
            imageStyles="hidden!"
            commentStyles="hidden!"
            authorImage={post?.profile_image}
            authorUsername={post.author_name}
            captions={post?.captions}
            media={post?.media_url}
          >
            <div className="flex flex-col gap-2 p-3 md:p-4">
              {comments.length < 1 ? (
                <p className="py-6 text-center text-sm text-white/50">
                  No comments yet. Be the first to comment.
                </p>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.comment_id} comment={comment} />
                ))
              )}
              <LoadMoreComments
                prevComments={comments}
                postId={id}
                createdAt={comments[comments.length - 1]?.created_at}
                cursor={comments[comments.length - 1]?.comment_id}
              />
            </div>
          </PostCard>
        </div>
      </div>
    </div>
  );
}
