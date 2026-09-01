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
import ReportPost from "./report";
import PostLink from "./post-link";

type Props = {
  postId: string;
  postAuthor: string;
  fileId: string;
  captions: string;
  published?: boolean;
};

export default function Menu({
  postId,
  postAuthor,
  fileId,
  captions,
  published,
}: Props) {
  if (!postId) return null;

  return (
    <Dialog key={postId}>
      <DialogTrigger className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-white">
        <Ellipsis />
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-xl border-gray-800 bg-zinc-950 p-0">
        <DialogTitle className="sr-only">Post options</DialogTitle>
        <div className="divide-y divide-gray-800">
          <ReportPost postId={postId} />
          <PostAction
            postAuthor={postAuthor}
            postId={postId}
            fileId={fileId}
            captions={captions}
            published={published}
          />
          <PostLink postId={postId} />
          <CopyLink postId={postId} />
        </div>
        <DialogClose asChild>
          <button className="flex w-full cursor-pointer items-center justify-center border-t border-gray-800 py-3 text-center text-sm text-white transition-colors hover:bg-white/5">
            Cancel
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
