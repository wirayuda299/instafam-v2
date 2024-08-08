import { Ellipsis } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import CopyLink from "./copy-link";
import PostAction from "./post-action";

type Props = { postId: string; postAuthor: string; fileId: string };

export default function Menu({ postId, postAuthor, fileId }: Props) {
  if (!postId) return null;

  return (
    <Dialog key={postId}>
      <DialogTrigger>
        <Ellipsis />
      </DialogTrigger>
      <DialogContent className="border-none bg-black">
        <ul className="space-y-3">
          <li className="flex w-full items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm text-red-600">
            Report
          </li>
          <PostAction postAuthor={postAuthor} postId={postId} fileId={fileId} />
          <Link
            href={`/post/${postId}`}
            className="flex w-full items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm"
          >
            Go to post
          </Link>
          <CopyLink postId={postId} />
          <li className="flex w-full items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm">
            About this account
          </li>{" "}
          <DialogClose asChild>
            <li className="flex w-full cursor-pointer items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm">
              Cancel
            </li>
          </DialogClose>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
