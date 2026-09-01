"use client";

import { copyText } from "@/utils/copy";

export default function CopyLink({ postId }: { postId: string }) {
  return (
    <div
      onClick={() =>
        copyText(
          `${process.env.NEXT_PUBLIC_CLIENT_URL}/post/${postId}`,
          "Link has been copied",
        )
      }
      className="flex w-full cursor-pointer items-center justify-center py-3 text-center text-sm text-white transition-colors hover:bg-white/5"
    >
      Copy link
    </div>
  );
}
