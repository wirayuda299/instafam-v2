import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = {
  Icon: JSX.Element;
  path: string;
  label: string;
  isCurrentPathMessages: boolean;
};

export default function ListItem({
  path,
  Icon,
  label,
  isCurrentPathMessages,
}: Props) {
  return (
    <li
      className={cn(
        "group rounded-md p-2 hover:bg-black-1/30 md:w-full",
        label === "messages" && "hidden md:block",
      )}
    >
      <Link href={path} className="flex items-center gap-3">
        {Icon}
        <span
          className={cn(
            "prose prose-sm capitalize text-white 2xl:prose-lg group-hover:brightness-110",

            isCurrentPathMessages ? "hidden" : "hidden md:block",
          )}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}
