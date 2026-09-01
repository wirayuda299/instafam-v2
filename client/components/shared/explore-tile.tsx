"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Post } from "@/types";
import { blurDataURL } from "@/utils/image-loader";

export default function ExploreTile({
  post,
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
      className="group relative mb-1 block overflow-hidden rounded-md break-inside-avoid bg-black-1 md:mb-2 md:rounded-lg"
    >
      <Image
        className="h-auto w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        onError={(e) =>
          (e.currentTarget.src = "/assets/shared/images/placeholder.png")
        }
        src={post.media_url ?? "/assets/shared/images/placeholder.png"}
        placeholder={blurDataURL(500, 500)}
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
