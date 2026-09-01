"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostLink({ postId }: { postId: string }) {
  const pathname = usePathname();
  if (pathname === `/post/${postId}`) {
    return null;
  }

  return (
    <Link
      href={`/post/${postId}`}
      className="flex w-full items-center justify-center py-3 text-center text-sm text-white transition-colors hover:bg-white/5"
    >
      Go to post
    </Link>
  );
}
