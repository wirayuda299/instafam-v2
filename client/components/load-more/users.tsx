'use client'

import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { User } from "@/types";
import UserListItem from "../shared/recommendations/user-list-item";
import { showUsers } from "@/helper/users";

type Props = { userId: string, prevUsers: User[], totalUsers: number }

export default function LoadMoreUsers({ prevUsers, totalUsers, userId }: Props) {
  const { ref, inView } = useInView();
  const [users, setUsers] = useState<User[]>(prevUsers);
  const [lastCursor, setLastCursor] = useState<string>(prevUsers.length ? new Date(prevUsers[prevUsers.length - 1].created_at).toISOString() : '');
  const [hasMoreUser, setHasMoreUser] = useState(prevUsers.length < totalUsers);

  const getAllUsers = useCallback(async () => {
    if (!lastCursor && users.length === 0) return;

    try {
      const res = await showUsers(userId, lastCursor);

      setUsers((prev) => [...prev, ...res.users]);

      if (res.users.length > 0) {
        const newLastUser = res.users[res.users.length - 1];
        const lastCursorTimestamp = new Date(newLastUser.created_at).toISOString();

        setLastCursor(lastCursorTimestamp);
      } else {
        setHasMoreUser(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [lastCursor, userId, users.length]);

  useEffect(() => {
    if (inView && hasMoreUser) {
      getAllUsers();
    }
  }, [inView, hasMoreUser, getAllUsers]);

  return (
    <>
      {users.map(user => <UserListItem user={user} key={user.id} userSessionId={userId} />)}

      {hasMoreUser && (
        <div ref={ref} className="w-full flex justify-center p-2">
          <Loader2 className="animate-spin" />





        </div>
      )}
    </>
  );
}

