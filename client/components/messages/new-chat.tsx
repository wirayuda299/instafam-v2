"use client";

import { Loader2, MessageCircle, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import useSearchUser from "@/hooks/useSearchUser";

export default function NewChat() {
  const { handleChange, loading, searchResult } = useSearchUser();

  return (
    <Dialog>
      <DialogTrigger>
        <SquarePen
          size={20}
          className="transition-colors hover:text-gray-400"
        />
      </DialogTrigger>
      <DialogContent className="overflow-y-auto border-gray-800 bg-zinc-950">
        <DialogTitle>Search user</DialogTitle>
        <input
          onChange={handleChange}
          type="text"
          className="bg-black-1/50 h-9 w-full rounded-md border border-gray-800 px-3 outline-hidden placeholder:text-sm placeholder:text-white/40 focus-visible:border-gray-600"
          placeholder="Search user..."
        />
        {loading ? (
          <div className="mt-3 flex justify-center gap-3">
            <Loader2 className="animate-spin" />
          </div>
        ) : searchResult && searchResult.length < 1 ? (
          <p className="py-6 text-center text-sm text-white/50">
            No users found.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {searchResult?.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <Image
                    className="size-11 min-w-11 rounded-full border border-gray-700 object-cover"
                    src={user?.profile_image}
                    width={45}
                    height={45}
                    alt="user"
                  />
                  <p className="text-sm font-semibold capitalize">
                    {user?.username}
                  </p>
                </div>
                <Link
                  href={`/messages/${user?.id}`}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <MessageCircle />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
