import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { getAllPosts } from "@/helper/posts";
import LoadMore from "@/components/load-more/posts";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic'

export default async function Explore() {
  const { posts, totalPosts } = await getAllPosts();

  return (
    <div className="grid max-h-screen min-h-screen w-full grid-cols-2 gap-0 overflow-y-auto md:grid-cols-3">
      {posts?.map((post, i) => (
        <Link
          href={`/post/${post?.post_id}`}
          key={post?.post_id}
          className="group relative"
        >
          <Image
            className={cn(
              "h-full w-full object-cover object-center",
              i % 2 === 0 ? "aspect-square" : "aspect-video",
            )}
            sizes="400px"
            src={post.media_url}
            priority={true}
            fetchPriority="high"
            width={500}
            height={500}
            alt="attachment"
          />
          <div className="ease absolute bottom-0 left-0 right-0 top-0 hidden h-full w-full bg-black/25 transition-all duration-300 group-hover:block">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2">
                <Heart />
                <p>{post.likes.length}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <LoadMore totalPosts={totalPosts} type="profile" prevPosts={posts} />
    </div>
  );
}
