"use client";

import Image from "next/image";
import Link from "next/link";

import { Post } from "@/types";
import { blurDataURL } from "@/utils/image-loader";

export default function PostCardImage({
  post,
  priority = false,
}: {
  post: Post;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/post/${post.post_id}`}
      className="max-w-[300px] min-w-36 flex-1 basis-36"
    >
      <Image
        className="aspect-square h-full w-full rounded-lg border border-gray-800 object-cover object-center transition-opacity hover:opacity-90"
        sizes="400px"
        onError={(e) =>
          (e.currentTarget.src = "/assets/shared/images/placeholder.png")
        }
        src={post.media_url ?? "/assets/shared/images/placeholder.png"}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder={blurDataURL(500, 400)}
        width={500}
        height={500}
        alt="attachment"
      />
    </Link>
  );
}
