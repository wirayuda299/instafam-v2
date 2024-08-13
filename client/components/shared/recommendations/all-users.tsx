"use client";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UserListItem from "./user-list-item";
import { User } from "@/types";

export default function AllUsers() {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useAuth();

  useEffect(() => {
    if (!isOpen || !userId) return;

    (async () => {
      try {
        setIsLoading(true);
        const { showUsers } = await import("@/helper/users");
        const users = await showUsers(userId, 0);
        if (users) {
          setAllUsers(users);
        }
      } catch (error) {
        toast.error((error as Error).message || "Failed to  fetch users");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isOpen]);
  return (
    <Dialog
      onOpenChange={(modalOpen) => {
        setIsOpen(modalOpen ? true : false);
      }}
    >
      <DialogTrigger asChild>
        <button className="text-sm">See all</button>
      </DialogTrigger>
      <DialogContent className="max-h-[400px] overflow-y-auto border-none bg-black p-0 text-white">
        {isLoading ? (
          <div className="flex w-full animate-pulse flex-col gap-3">
            <div className="h-9 w-full rounded-md bg-black-1/50"></div>
            <div className="h-9 w-full rounded-md bg-black-1/50"></div>
            <div className="h-9 w-full rounded-md bg-black-1/50"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-2">
            {allUsers?.map((user) => (
              <UserListItem
                key={user?.id}
                user={user}
                userSessionId={userId!}
                styles="hover:bg-black-1/50 rounded-md p-1"
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
