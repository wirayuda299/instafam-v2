"use client";

import { Bot, Camera, Menu } from "lucide-react";
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
import { JSX } from "react";

const RenderItemBasedOnLabel = (
  label: string,
  isCurrentPathMessages: boolean,
  Icon: JSX.Element,
  path: string,
  isActive: boolean,
) => {
  switch (label) {
    case "search":
      return (
        <SearchForm key={label} isCurrentPathMessages={isCurrentPathMessages} />
      );
    case "notifications":
      return (
        <Notifications key={label}>
          <li className="group hidden rounded-md border-l-2 border-transparent p-2 transition-colors hover:bg-white/5 md:block md:w-full">
            <button className="flex items-center gap-3 text-white/60 transition-colors hover:text-white">
              {Icon}
              <span
                className={cn(
                  "prose prose-sm 2xl:prose-lg capitalize",
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
          isActive={isActive}
          label={label}
        />
      );
  }
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isCurrentPathMessages = pathname.startsWith("/messages");
  const isProfileActive =
    pathname.startsWith("/profile") && pathname.includes(user?.id ?? "\0");

  return (
    <aside
      className={cn(
        "fixed! right-0! bottom-0! left-0! z-50! h-14 max-w-[250px] min-w-[250px] flex-col justify-end border-gray-800 bg-zinc-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl max-md:max-w-full md:static! md:z-0 md:flex md:h-full md:max-h-screen md:min-h-screen md:justify-between md:overflow-y-auto md:border-r md:bg-zinc-950 md:p-3 md:pb-3 md:backdrop-blur-none",
        isCurrentPathMessages ? "md:w-min md:max-w-min md:min-w-min" : "",
      )}
    >
      <header className="hidden w-full py-2 md:block">
        <Link href={"/"} className="flex items-center gap-2.5">
          {!isCurrentPathMessages ? (
            <>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-fuchsia-600 text-white">
                <Camera size={18} strokeWidth={2.5} />
              </span>
              <span className="prose prose-2xl font-semibold text-white xl:font-semibold">
                Instafam
              </span>
            </>
          ) : (
            <Bot size={45} className="mx-auto text-white" />
          )}
        </Link>
      </header>
      <ul className="flex h-14 w-full min-w-full items-center justify-around border-t border-gray-800 p-2 md:h-full md:min-h-full md:flex-col md:items-end md:justify-start md:gap-3 md:border-none md:p-0 2xl:gap-4">
        {sidebarItems?.map((item) =>
          RenderItemBasedOnLabel(
            item.label,
            isCurrentPathMessages,
            item.icon,
            item.path,
            pathname === item.path,
          ),
        )}
        <li
          className={cn(
            "group mt-0 rounded-md border-l-2 border-transparent p-2 transition-colors hover:bg-white/5 md:mt-3 md:w-full md:border-t md:border-l-0 md:border-gray-800 md:pt-4",
            isProfileActive &&
              "bg-white/10 md:border-l-2 md:border-t-transparent md:border-l-blue-500",
          )}
        >
          <Link
            aria-label="profile"
            aria-current={isProfileActive ? "page" : undefined}
            href={`/profile/${user?.id}?tab=posts`}
            className={cn(
              "flex items-center gap-3 transition-colors",
              isProfileActive ? "text-white" : "text-white/60 hover:text-white",
            )}
          >
            <Image
              src={user?.imageUrl ?? "/next.svg"}
              className={cn(
                "size-[30px] h-full max-h-[30px] min-h-[30px] w-full max-w-[30px] min-w-[30px] rounded-full border object-cover object-center transition-colors",
                isProfileActive ? "border-white" : "border-gray-600",
              )}
              sizes="30px"
              priority
              width={30}
              height={30}
              alt="profile"
            />
            <span
              className={cn(
                "prose prose-sm 2xl:prose-lg capitalize",
                isProfileActive ? "font-semibold text-white" : "text-inherit",
                isCurrentPathMessages ? "hidden" : "hidden md:block",
              )}
            >
              Profile
            </span>
          </Link>
        </li>
      </ul>
      <button
        title="more"
        name="more"
        className="group mt-3 hidden w-full items-center gap-3 rounded-md px-3 py-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white md:flex"
      >
        <Menu />
        {!isCurrentPathMessages && (
          <span className="prose prose-sm 2xl:prose-lg capitalize">More</span>
        )}
      </button>
    </aside>
  );
}
