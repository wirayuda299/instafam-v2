"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Post } from "@/types";
import { blurDataURL } from "@/utils/image-loader";
import { cn } from "@/lib/utils";

export default function ExploreTile({
  post,
  index,
  priority = false,
}: {
  post: Post;
  index: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/post/${post?.post_id}`}
      key={post.post_id}
      className="group relative"
    >
      <Image
        className={cn(
          "w-full object-cover object-center",
          index % 2 === 0 ? "aspect-square" : "aspect-video",
        )}
        sizes="400px"
        onError={(e) =>
          (e.currentTarget.src = "/assets/shared/images/placeholder.png")
        }
        src={post.media_url ?? "/assets/shared/images/placeholder.png"}
        placeholder={blurDataURL(400, 400)}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        width={500}
        height={500}
        alt="attachment"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Heart className="fill-white" size={22} />
          <p>{post.likes.length}</p>
        </div>
      </div>
    </Link>
  );
}
