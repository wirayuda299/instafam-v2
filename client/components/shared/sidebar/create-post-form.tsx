"use client";

import dynamic from "next/dynamic";
import { JSX, useCallback, useState } from "react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CreatePostFormContent = dynamic(
  () => import("./create-post-form-content"),
  { ssr: false },
);

type Props = {
  Icon: JSX.Element;
  label: string;
  isCurrentPathMessages: boolean;
};

export default function CreatePostForm({
  Icon,
  isCurrentPathMessages,
  label,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && loading) return;
      setIsOpen(open);
    },
    [loading],
  );

  return (
    <Dialog open={isOpen} modal={false} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <li className="group hover:bg-black-1/30 rounded-md p-2 transition-colors md:w-full">
          <button
            type="button"
            className="flex items-center gap-3 text-white/60 transition-colors hover:text-white"
          >
            {Icon}
            <span
              data-testid="cpf-label"
              className={cn(
                "prose prose-sm 2xl:prose-lg capitalize",
                isCurrentPathMessages ? "hidden" : "hidden md:block",
              )}
            >
              {label}
            </span>
          </button>
        </li>
      </DialogTrigger>
      {isOpen && (
        <CreatePostFormContent
          onClose={() => setIsOpen(false)}
          onLoadingChange={setLoading}
        />
      )}
    </Dialog>
  );
}
