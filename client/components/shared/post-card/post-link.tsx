
'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostLink({ postId }: { postId: string }) {
  const pathname = usePathname()
  if (pathname === `/post/${postId}`) {
    return null
  }

  return (
    <Link
      href={`/post/${postId}`}
      className="flex w-full items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm"
    >
      Go to post
    </Link>
  )
}