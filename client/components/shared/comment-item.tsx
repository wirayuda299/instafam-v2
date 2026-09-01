import Image from "next/image";

import { Comment } from "@/types";
import { blurDataURL } from "@/utils/image-loader";
import { formatMessageTimestamp } from "@/utils/date";
import CommentLikeButton from "@/components/shared/comment-like-button";

export default function CommentItem({ comment }: { comment: Comment }) {
  const likeCount = comment.likes?.length ?? 0;

  return (
    <div className="flex w-full items-start justify-between gap-2 rounded-md p-2 transition-colors hover:bg-white/5">
      <div className="flex gap-2">
        <Image
          loading="lazy"
          placeholder={blurDataURL(50, 50)}
          className="aspect-auto size-10 min-w-10 rounded-full border border-gray-700 object-cover"
          src={comment.profile_image}
          width={40}
          height={40}
          alt="profile"
        />
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-sm font-semibold text-white">
              {comment.username}
            </h3>
            <p className="text-sm text-white/80">{comment.comment}</p>
          </div>
          <div className="flex items-center gap-3 pt-1 text-xs text-gray-500">
            <span>{formatMessageTimestamp(comment.created_at)}</span>
            {likeCount > 0 && (
              <span>
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            )}
          </div>
        </div>
      </div>
      <CommentLikeButton likes={comment.likes} commentId={comment.comment_id} />
    </div>
  );
}
