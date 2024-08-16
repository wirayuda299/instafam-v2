"use client";

import { Bot, Menu } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { sidebarItems } from "@/constants";
import SearchForm from "./search-form";
import ListItem from "./list-item";
import { cn } from "@/lib/utils";
import Notifications from "./notifications";
import CreatePostForm from "./create-post-form";

const RenderItemBasedOnLabel = (
  label: string,
  isCurrentPathMessages: boolean,
  Icon: JSX.Element,
  path: string,
) => {
  switch (label) {
    case "search":
      return (
        <SearchForm key={label} isCurrentPathMessages={isCurrentPathMessages} />
      );
    case "notifications":
      return (
        <Notifications key={label}>
          <li className="group hidden rounded-md p-2 hover:bg-black-1/30 md:block md:w-full">
            <button className="flex items-center gap-3">
              {Icon}
              <span
                className={cn(
                  "prose prose-sm capitalize text-white 2xl:prose-lg group-hover:brightness-110",
                  isCurrentPathMessages ? "hidden" : "hidden md:block",
                )}
              >
                {label}
              </span>
            </button>
          </li>
        </Notifications>
      );
    case "create":
      return (
        <CreatePostForm
          key={label}
          isCurrentPathMessages={isCurrentPathMessages}
          Icon={Icon}
          label={label}
        />
      );
    default:
      return (
        <ListItem
          Icon={Icon}
          path={path}
          key={label}
          isCurrentPathMessages={isCurrentPathMessages}
          label={label}
        />
      );
  }
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isCurrentPathMessages = pathname.startsWith("/messages");

  return (
    <aside
      className={cn(
        "!fixed !bottom-0 !left-0 !right-0 !z-50 h-14 min-w-[250px] max-w-[250px] flex-col justify-end border-gray-600/30 bg-black max-md:max-w-full md:!static md:z-0 md:flex md:h-full md:max-h-screen md:min-h-screen md:justify-between md:overflow-y-auto md:border-r md:p-3",
        isCurrentPathMessages ? "md:w-min md:min-w-min md:max-w-min" : "",
      )}
    >
      <header className="hidden w-full py-2 md:block">
        <Link href={"/"}>
          {!isCurrentPathMessages ? (
            <span className="prose prose-2xl font-semibold text-white xl:font-semibold">
              Instafam
            </span>
          ) : (
            <Bot size={45} className="mx-auto text-white" />
          )}
        </Link>
      </header>
      <ul className="flex h-14 w-full min-w-full items-center justify-between border-t border-gray-600/50 p-2 md:h-full md:min-h-full md:flex-col md:items-end md:gap-6 md:border-none md:p-0 2xl:gap-12">
        {sidebarItems?.map((item) =>
          RenderItemBasedOnLabel(
            item.label,
            isCurrentPathMessages,
            item.icon,
            item.path,
          ),
        )}
        <li className="group rounded-md p-2 hover:bg-black-1/30 md:w-full">
          <Link
						aria-label="profile"
            href={`/profile/${user?.id}?tab=posts`}
            className="flex items-center gap-3"
          >
            <Image
              src={user?.imageUrl ?? "/next.svg"}
              className="size-[30px] h-full max-h-[30px] min-h-[30px] w-full min-w-[30px] max-w-[30px] rounded-full border border-gray-600 object-cover object-center"
              sizes="30px"
              priority
              width={30}
              height={30}
              alt="profile"
            />
            <span
              className={cn(
                "prose prose-sm capitalize text-white 2xl:prose-lg group-hover:brightness-110",
                isCurrentPathMessages ? "hidden" : "hidden md:block",
              )}
            >
              Profile
            </span>
          </Link>
        </li>
      </ul>
      <button title='more' name="more" className="group mt-3 hidden w-full items-center gap-3 px-3 md:flex">
        <Menu />
        {!isCurrentPathMessages && (
          <span className="prose prose-sm capitalize text-white 2xl:prose-lg group-hover:brightness-110">
            More
          </span>
        )}
      </button>
    </aside>
  );
}
