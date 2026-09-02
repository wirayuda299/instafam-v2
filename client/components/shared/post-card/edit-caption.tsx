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
import { updatePostCaptions } from "@/actions/post";

type Props = { postId: string; captions: string };

export default function EditCaption({ postId, captions }: Props) {
  const [value, setValue] = useState(captions);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await updatePostCaptions(postId, value);
      if (res && "errors" in res) {
        toast.error(res.errors || "Failed to update caption");
        return;
      }
      toast.success("Caption updated");
      setIsOpen(false);
    } catch (error) {
      toast.error((error as Error).message || "Failed to update caption");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setValue(captions);
      }}
    >
      <DialogTrigger asChild>
        <div className="flex w-full cursor-pointer items-center justify-center py-3 text-center text-sm text-white transition-colors hover:bg-white/5">
          Edit caption
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-xl border-gray-800 bg-zinc-950 p-0">
        <DialogTitle className="border-b border-gray-800 py-3 text-center">
          Edit caption
        </DialogTitle>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          maxLength={500}
          autoFocus
          className="w-full resize-none bg-transparent p-4 text-sm text-white placeholder:text-white/40 focus-visible:outline-hidden"
          placeholder="Add captions..."
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isSubmitting}
          className="m-4 mt-0 flex items-center justify-center gap-2 rounded-md bg-blue-600 p-2 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Save
        </button>
      </DialogContent>
    </Dialog>
  );
}
