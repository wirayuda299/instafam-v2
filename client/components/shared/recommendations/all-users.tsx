"use client";

import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserListItem from "./user-list-item";
import { User } from "@/types";
import LoadMoreUsers from "@/components/load-more/users";

export default function AllUsers() {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<{
    users: User[];
    totalUser: number;
  }>({ users: [], totalUser: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const { userId } = useAuth();

  useEffect(() => {
    if (!isOpen || !userId) return;
    setIsLoading(true);

    (async () => {
      try {
        const { showUsers } = await import("@/helper/users");
        const { users, totalUser } = await showUsers(userId);
        setAllUsers({
          users,
          totalUser,
        });
      } catch (error) {
        toast.error((error as Error).message || "Failed to  fetch users");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isOpen, userId]);

  return (
    <Dialog onOpenChange={(modalOpen) => setIsOpen(modalOpen ? true : false)}>
      <DialogTrigger asChild>
        <button className="text-sm text-white/60 transition-colors hover:text-white">
          See all
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[400px] overflow-y-auto border border-gray-800 bg-zinc-950 p-0 text-white">
        <DialogTitle className="border-b border-gray-800 p-3 text-lg font-semibold text-white">
          Suggested users
        </DialogTitle>
        {isLoading ? (
          <div className="flex w-full animate-pulse flex-col gap-3 p-3">
            <div className="bg-black-1/50 h-9 w-full rounded-md"></div>
            <div className="bg-black-1/50 h-9 w-full rounded-md"></div>
            <div className="bg-black-1/50 h-9 w-full rounded-md"></div>
          </div>
        ) : allUsers.users.length < 1 ? (
          <p className="py-10 text-center text-sm text-white/50">
            No users to show.
          </p>
        ) : (
          <div className="flex flex-col gap-1 p-2">
            {allUsers.users.map((user) => (
              <UserListItem
                key={user?.id}
                user={user}
                userSessionId={userId!}
                styles="hover:bg-white/5 rounded-md p-2"
              />
            ))}
            <LoadMoreUsers
              userId={userId!}
              prevUsers={allUsers.users}
              totalUsers={allUsers.totalUser}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
