import Image from "next/image";
import { notFound } from "next/navigation";

import PostCard from "@/components/shared/post-card";
import { shimmer, toBase64 } from "@/utils/image-loader";
import { getPostById } from "@/helper/posts";
import { getAllComments } from "@/helper/comments";
import LoadMoreComments from "@/components/load-more/comments";
import CommentLikeButton from "@/components/comment-like-button";

type Params = {
  params: {
    id: string;
  };
};

export default async function PostDetail({ params }: Params) {
  const post = await getPostById(params.id);
  if (!post) return notFound();

  const comments = await getAllComments(params.id);

  return (
    <div className="flex max-h-screen min-h-dvh w-full flex-col items-center justify-center gap-3 divide-y divide-gray-600 overflow-y-auto px-3 max-lg:max-h-dvh lg:min-h-screen">
      <div className="flex h-full max-h-[510px] min-h-[510px] w-full max-w-screen-lg max-lg:max-h-full max-lg:flex-col">
        <Image
          className="aspect-auto max-h-[510px] w-full max-w-[450px] rounded-lg border border-gray-600 object-cover object-center max-lg:max-h-[300px] max-lg:max-w-full"
          src={post?.media_url}
          loading="lazy"
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`}
          width={500}
          height={500}
          alt="attachment"
        />
        <div className="w-full max-lg:max-h-full max-lg:max-w-full md:overflow-y-auto">
          <PostCard
            fileId={post.media_asset_id}
            createdAt={post.createdat}
            authorId={post.author_id}
            likes={post.likes || []}
            priority={true}
            loading="eager"
            postId={params.id}
            actionButtonStyles="sticky bottom-0 border-t border-gray-500/50"
            rootStyles="md:justify-between w-full h-full"
            headerStyles="lg:sticky top-0 z-10 bg-black border-b border-gray-500/50 p-2"
            imageStyles="!hidden"
            commentStyles="!hidden"
            authorImage={post?.profile_image}
            authorUsername={post.author_name}
            captions={post?.captions}
            media={post?.media_url}
          >
            <div className="flex h-full max-h-[500px] min-h-[280px] flex-col justify-items-start gap-5 justify-self-start overflow-y-auto px-2">
              {comments?.map((comment) => (
                <div
                  key={comment.comment_id}
                  className="flex w-full justify-between gap-2 rounded-md p-1 hover:bg-black-1/50"
                >
                  <div className="flex gap-2">
                    <Image
                      loading="lazy"
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(50, 50))}`}
                      className="aspect-auto size-12 min-w-12 rounded-full object-cover"
                      src={comment.profile_image}
                      width={45}
                      height={45}
                      alt="profile"
                    />
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <h3 className="text-sm font-semibold">
                          {comment.username}
                        </h3>
                        <div>
                          <p className="text-xs">{comment.comment}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-xs text-gray-500">
                        <p>1m</p>
                        <p>5 like</p>
                      </div>
                    </div>
                  </div>
                  <CommentLikeButton
                    likes={comment.likes}
                    commentId={comment.comment_id}
                  />
                </div>
              ))}
              <LoadMoreComments
                prevComments={comments}
                postId={params.id}
                createdAt={comments[comments.length - 1]?.createdat}
                cursor={comments[comments.length - 1]?.comment_id}
              />
            </div>
          </PostCard>
        </div>
      </div>
    </div>
  );
}
