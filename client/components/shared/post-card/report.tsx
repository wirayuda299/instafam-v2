"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { handleError } from "@/utils/error";
import { REPORT_POST_REASONS } from "@/constants";

export default function ReportPost({ postId }: { postId: string }) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOrRemoveReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons((prev) => prev.filter((r) => r !== reason));
    } else {
      setSelectedReasons((prev) => prev.concat(reason));
    }
  };

  const handleReport = async () => {
    if (selectedReasons.length < 1 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { reportPost } = await import("@/actions/post");

      const reasons = await reportPost(postId, selectedReasons);
      if (reasons && "errors" in reasons) {
        handleError(reasons, "Failed to report post");
        return;
      }

      toast.success("Post has been reported");
    } catch (e) {
      toast.error((e as Error).message || "Failed to report post");
    } finally {
      setIsSubmitting(false);
      setSelectedReasons([]);
    }
  };

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedReasons([])}>
      <DialogTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-center py-3 text-center text-sm text-red-500 transition-colors hover:bg-white/5">
          Report
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-gray-800 bg-zinc-950 p-0">
        <DialogTitle className="border-b border-gray-800 py-3 text-center">
          Report Post
        </DialogTitle>
        <div className="flex flex-wrap gap-2 p-4 text-center">
          {REPORT_POST_REASONS.map((reason) => (
            <button
              title={reason}
              name={reason}
              onClick={() => handleSelectOrRemoveReason(reason)}
              key={reason}
              className={cn(
                "cursor-pointer rounded-full border border-gray-700 px-3 py-2 text-xs text-white/80 transition-colors hover:border-gray-500",
                selectedReasons.includes(reason)
                  ? "border-red-500 text-white"
                  : "",
              )}
            >
              {reason}
            </button>
          ))}
        </div>
        <button
          onClick={handleReport}
          disabled={selectedReasons.length < 1 || isSubmitting}
          className="m-4 mt-0 flex items-center justify-center gap-2 rounded-md bg-blue-600 p-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="report"
          name="report"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Report
        </button>
      </DialogContent>
    </Dialog>
  );
}
