"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useSearchUser from "@/hooks/useSearchUser";

export default function SearchForm({ isCurrentPathMessages, }: { isCurrentPathMessages: boolean }) {

  const { handleChange, searchResult, loading } = useSearchUser()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <li className="group cursor-pointer rounded-md p-2 hover:bg-black-1/30 md:w-full">
          <div className="flex items-center gap-3">
            <Search size={25} className="text-2xl" />
            {!isCurrentPathMessages ? (
              <span className="prose prose-sm hidden capitalize text-white 2xl:prose-lg group-hover:brightness-110 md:block">
                Search
              </span>
            ) : null}
          </div>
        </li>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="overflow-y-auto border-black-1 bg-black text-white"
      >
        <input
          onChange={handleChange}
          type="text"
          className="h-8 w-full rounded-md border-none bg-black-1 px-3 outline-none placeholder:text-sm focus-visible:border-none"
          placeholder="Search user..."
        />
        {loading ? (
          <div className="mt-3 flex animate-pulse flex-col gap-3">
            <div className="h-9 w-full rounded-md bg-black-1"></div>
            <div className="h-9 w-full rounded-md bg-black-1"></div>
            <div className="h-9 w-full rounded-md bg-black-1"></div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 space-y-2">
            {searchResult?.map((user) => (
              <li
                key={user.id}
                className="mt-2 flex items-center gap-3 rounded-md p-1 hover:bg-black-1/50"
              >
                <Image
                  className="size-11 min-w-11 rounded-full"
                  src={user.profile_image}
                  width={45}
                  height={45}
                  alt="user"
                />
                <Link href={`/profile/${user?.id}?tab=posts`}>
                  {user.username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
