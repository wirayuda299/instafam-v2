import { Ellipsis } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CopyLink from "./copy-link";
import PostAction from "./post-action";
import ReportPost from "./Report";
import PostLink from "./post-link";

type Props = { postId: string; postAuthor: string; fileId: string };

export default function Menu({ postId, postAuthor, fileId }: Props) {
  if (!postId) return null;

  return (
    <Dialog key={postId}>
      <DialogTrigger >
        <Ellipsis />
      </DialogTrigger>
      <DialogContent className="border-black-1/50 bg-black">

        <DialogTitle className="space-y-3">
          <ReportPost postId={postId} />
          <PostAction postAuthor={postAuthor} postId={postId} fileId={fileId} />
          <PostLink postId={postId} />
          <CopyLink postId={postId} />
          <DialogClose asChild>
            <li className="flex w-full cursor-pointer items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm">
              Cancel
            </li>
          </DialogClose>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
