'use client'

import { Loader, MessageCircle, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import useSearchUser from "@/hooks/useSearchUser";


export default function NewChat() {
  const { handleChange, loading, searchResult } = useSearchUser()

  return (
    <Dialog>
      <DialogTrigger>
        <SquarePen size={20}/>
      </DialogTrigger>
      <DialogContent className="bg-black border-black-1 overflow-y-auto">
        <DialogTitle>Search user</DialogTitle>
        <input
          onChange={handleChange}
          type="text"
          className="h-9 w-full rounded-md border-none bg-black-1 px-3 outline-none placeholder:text-sm focus-visible:border-none"
          placeholder="Search user..."
        />
        {loading ? (
          <div className="mt-3 flex justify-center gap-3">
              <Loader className='animate-spin'/>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 space-y-2">
            {searchResult?.map((user) => (
              <li
                key={user.id}
                className="mt-2 flex items-center justify-between  gap-3 rounded-md p-1 hover:bg-black-1/50"
              >
                <div className="flex items-center gap-2">
                  <Image
                    className="size-11 min-w-11 rounded-full"
                    src={user?.profile_image}
                    width={45}
                    height={45}
                    alt="user"
                  />
                  <p className="font-semibold text-sm capitalize">{user?.username}</p>
                </div>
                  <Link href={`/messages/${user?.id}`}>
                    <MessageCircle />
                  </Link>
              </li>
            ))}
          </ul>
        )}

      </DialogContent>
    </Dialog>
  )
}
