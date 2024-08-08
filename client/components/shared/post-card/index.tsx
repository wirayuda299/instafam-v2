import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { shimmer, toBase64 } from "@/utils/image-loader";
import Captions from "./captions";
import CommentForm from "./comment-form";
import { cn } from "@/lib/utils";
import Menu from "./menu";
import LikeButton from "./like-button";
import { Like } from "@/types";
import { formatMessageTimestamp } from "@/utils/date";
import Bookmarks from "./bookmarks";

type Props = {
  authorImage: string;
  fileId: string;
  likes: Like[];
  authorUsername: string;
  media: string;
  captions: string;
  postId: string;
  priority: boolean;
  authorId: string;
  createdAt: string;
  imageStyles?: string;
  headerStyles?: string;
  rootStyles?: string;
  actionButtonStyles?: string;
  commentStyles?: string;
  children?: ReactNode;
  loading?: "eager" | "lazy";
};

export default function PostCard({
  captions,
  authorImage,
  authorUsername,
  media,
  children,
  imageStyles,
  headerStyles,
  rootStyles,
  likes,
  actionButtonStyles,
  commentStyles,
  postId,
  priority = false,
  loading = "eager",
  authorId,
  createdAt,
  fileId,
}: Props) {
  return (
    <article
      className={cn(
        "flex h-full min-h-max w-full max-w-full flex-col gap-4 p-2 max-md:max-w-full",
        rootStyles,
      )}
    >
      <header
        className={cn("flex w-full items-center justify-between", headerStyles)}
      >
        <div className="flex items-center gap-3">
          <Image
            loading="lazy"
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(50, 50))}`}
            sizes="45px"
            className="aspect-auto size-10 min-w-10 rounded-full object-cover md:size-12 md:min-w-12 2xl:size-14 2xl:min-w-14"
            src={authorImage}
            width={45}
            height={45}
            alt="profile"
          />
          <div>
            <Link
              href={`/profile/${authorId}?tab=posts`}
              className="prose prose-sm font-semibold capitalize text-white lg:prose-lg"
            >
              {authorUsername}
            </Link>
            <small className="block text-xs opacity-50">
              {formatMessageTimestamp(createdAt)}
            </small>
          </div>
        </div>
        <Menu postId={postId} postAuthor={authorId} fileId={fileId} />
      </header>
      <Suspense fallback={"loading..."}>{children}</Suspense>
      <div className="h-full">
        <Image
          className={cn(
            "aspect-square h-fit !max-h-[380px] w-full rounded-lg border border-gray-600 object-cover object-center",
            imageStyles,
          )}
          quality={50}
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
          sizes="400px"
          src={media}
          fetchPriority={priority ? "high" : "low"}
          priority={priority}
          loading={loading}
          width={500}
          height={500}
          alt="attachment"
        />
        <div
          className={cn(
            "flex items-center justify-between gap-2 pt-2",
            actionButtonStyles,
          )}
        >
          <div className="flex items-center gap-3">
            <LikeButton likes={likes} postId={postId} key={postId} />
            <Link
              href={`/post/${postId}`}
              title="comment"
              aria-label="comment"
              className="group"
            >
              <MessageCircle size={30} className="group-hover:text-gray-500" />
            </Link>
          </div>
          <Bookmarks postId={postId} />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <p className="prose prose-sm font-semibold capitalize text-white lg:prose-lg">
            {authorUsername}
          </p>
          <Captions captions={captions} />
        </div>
        <Link
          href={`/post/${postId}`}
          className={cn("py-2 text-sm text-gray-500", commentStyles)}
        >
          View all comments
        </Link>
        <CommentForm postId={postId} />
      </div>
    </article>
  );
}
