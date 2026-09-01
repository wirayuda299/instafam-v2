"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useSearchUser from "@/hooks/useSearchUser";

export default function SearchForm({
  isCurrentPathMessages,
}: {
  isCurrentPathMessages: boolean;
}) {
  const { handleChange, searchResult, searchQuery, loading } = useSearchUser();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <li className="group cursor-pointer rounded-md border-l-2 border-transparent p-2 transition-colors hover:bg-white/5 md:w-full">
          <div className="flex items-center gap-3 text-white/60 transition-colors group-hover:text-white">
            <Search size={25} className="text-2xl" />
            {!isCurrentPathMessages ? (
              <span className="prose prose-sm 2xl:prose-lg hidden capitalize md:block">
                Search
              </span>
            ) : null}
          </div>
        </li>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="overflow-y-auto border-gray-800 bg-zinc-950 text-white"
      >
        <SheetTitle className="py-2 text-white">Search user</SheetTitle>
        <input
          onChange={handleChange}
          type="text"
          className="bg-black-1/50 h-9 w-full rounded-md border border-gray-800 px-3 outline-hidden placeholder:text-sm placeholder:text-white/40 focus-visible:border-gray-600"
          placeholder="Search user..."
        />
        {loading ? (
          <div className="mt-3 flex animate-pulse flex-col gap-3">
            <div className="bg-black-1 h-9 w-full rounded-md"></div>
            <div className="bg-black-1 h-9 w-full rounded-md"></div>
            <div className="bg-black-1 h-9 w-full rounded-md"></div>
          </div>
        ) : searchResult && searchResult.length > 0 ? (
          <ul className="flex flex-col gap-1 pt-3">
            {searchResult.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/5"
              >
                <Image
                  className="size-11 min-w-11 rounded-full border border-gray-700 object-cover"
                  src={user.profile_image}
                  width={45}
                  height={45}
                  alt="user"
                />
                <Link
                  href={`/profile/${user?.id}?tab=posts`}
                  className="text-sm font-medium text-white"
                >
                  {user.username}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-white/50">
            {searchQuery ? "No users found." : "Search for people by username."}
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
