"use client";

import { copyText } from "@/utils/copy";

export default function CopyLink({ postId }: { postId: string }) {
  return (
    <li
      onClick={() =>
        copyText(
          `${process.env.NEXT_PUBLIC_CLIENT_URL}/post/${postId}`,
          "Link has been copied",
        )
      }
      className="flex w-full cursor-pointer items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm"
    >
      Copy link
    </li>
  );
}
