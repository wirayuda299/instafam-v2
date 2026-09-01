import Link from "next/link";

import { cn } from "@/lib/utils";
import { JSX } from "react";

type Props = {
  Icon: JSX.Element;
  path: string;
  label: string;
  isCurrentPathMessages: boolean;
  isActive?: boolean;
};

export default function ListItem({
  path,
  Icon,
  label,
  isCurrentPathMessages,
  isActive = false,
}: Props) {
  return (
    <li
      className={cn(
        "group rounded-md border-l-2 border-transparent p-2 transition-colors hover:bg-white/5 md:w-full",
        isActive && "border-blue-500 bg-white/10",
        label === "messages" && "hidden md:block",
      )}
    >
      <Link
        href={path}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 transition-colors",
          isActive ? "text-white" : "text-white/60 hover:text-white",
        )}
      >
        {Icon}
        <span
          className={cn(
            "prose prose-sm 2xl:prose-lg capitalize",
            isActive ? "font-semibold text-white" : "text-inherit",
            isCurrentPathMessages ? "hidden" : "hidden md:block",
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}
