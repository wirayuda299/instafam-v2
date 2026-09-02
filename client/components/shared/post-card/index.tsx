import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { blurDataURL } from "@/utils/image-loader";
import Captions from "./captions";
import CommentForm from "./comment-form";
import { cn } from "@/lib/utils";
import Menu from "./menu";
import LikeButton from "./like-button";
import { Like } from "@/types";
import { formatMessageTimestamp } from "@/utils/date";
import Bookmarks from "./bookmarks";

type Props = {
  styles?: string;
  authorImage: string;
  fileId: string;
  likes: Like[];
  authorUsername: string;
  media: string;
  captions: string;
  postId: string;
  priority: boolean;
  authorId: string;
  created_at: string;
  imageStyles?: string;
  headerStyles?: string;
  rootStyles?: string;
  actionButtonStyles?: string;
  commentStyles?: string;
  children?: ReactNode;
  loading?: "eager" | "lazy";
  published?: boolean;
};

function CommentsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 px-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="bg-black-1/60 size-8 shrink-0 rounded-full" />
          <div className="bg-black-1/60 h-3 w-2/3 rounded" />
        </div>
      ))}
    </div>
  );
}

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
  created_at,
  fileId,
  styles,
  published,
}: Props) {
  return (
    <article
      className={cn(
        "bg-black-1/30 flex h-full w-full max-w-full flex-col rounded-xl border border-gray-800 shadow-sm max-md:max-w-full",
        rootStyles,
      )}
    >
      <header
        className={cn(
          "flex w-full shrink-0 items-center justify-between p-3 md:p-4",
          headerStyles,
        )}
      >
        <div className="flex items-center gap-3">
          <Image
            loading="lazy"
            placeholder={blurDataURL(50, 50)}
            sizes="45px"
            className="aspect-auto size-10 min-w-10 rounded-full border border-gray-700 object-cover md:size-12 md:min-w-12 2xl:size-14 2xl:min-w-14"
            src={authorImage ?? "/next.svg"}
            width={45}
            height={45}
            alt="profile"
          />
          <div>
            <Link
              href={`/profile/${authorId}?tab=posts`}
              className="prose prose-sm lg:prose-lg font-semibold text-white capitalize transition-colors hover:text-white/80"
            >
              {authorUsername}
            </Link>
            <small
              title={new Date(created_at).toLocaleString()}
              className="block text-xs text-white/50"
            >
              {formatMessageTimestamp(created_at)}
            </small>
          </div>
        </div>
        <Menu
          postId={postId}
          postAuthor={authorId}
          fileId={fileId}
          captions={captions}
          published={published}
        />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Suspense fallback={<CommentsSkeleton />}>{children}</Suspense>
      </div>
      <div className="flex shrink-0 flex-col gap-3 p-3 md:p-4">
        <Image
          className={cn(
            "aspect-square h-fit max-h-[380px]! w-full rounded-lg border border-gray-600 object-cover object-center",
            imageStyles,
          )}
          quality={50}
          placeholder={blurDataURL(400, 400)}
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
            "flex items-center justify-between gap-2",
            actionButtonStyles,
          )}
        >
          <div className="flex items-center gap-3">
            <LikeButton
              likes={likes}
              postId={postId}
              postAuthor={authorId}
              key={postId}
            />
            <Link
              href={`/post/${postId}`}
              title="comment"
              aria-label="comment"
              className="group"
            >
              <MessageCircle
                size={30}
                className="transition-colors group-hover:text-gray-500"
              />
            </Link>
          </div>
          <Bookmarks authorId={authorId} postId={postId} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="prose prose-sm lg:prose-lg font-semibold text-white capitalize">
            {authorUsername}
          </p>
          <Captions captions={captions} />
        </div>
        <Link
          href={`/post/${postId}`}
          className={cn(
            "block text-sm text-gray-500 transition-colors hover:text-gray-300",
            commentStyles,
          )}
        >
          View all comments
        </Link>
        <CommentForm styles={styles} postId={postId} />
      </div>
    </article>
  );
}
