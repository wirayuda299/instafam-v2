"use client";

import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      aria-disabled={pending}
      name="submit"
      title="submit"
      className="disabled:cursor-not-allowed"
    >
      <SendHorizontal
        size={20}
        className={cn("text-gray-500", pending && "animate-pulse")}
      />
    </button>
  );
}
