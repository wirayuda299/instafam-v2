"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getNotifications } from "@/helper/notifications";
import { markNotificationsRead } from "@/actions/notifications";
import { useSocketContext } from "@/context/socket";
import { blurDataURL } from "@/utils/image-loader";
import { formatMessageTimestamp } from "@/utils/date";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";

const NOTIFICATION_ICON: Record<NotificationType, typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
};

const NOTIFICATION_MESSAGE: Record<NotificationType, string> = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
};

export default function Notifications({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const { socket } = useSocketContext();

  const { data: notifications = [], mutate } = useSWR(
    userId ? `notifications/${userId}` : null,
    () => getNotifications(userId!),
  );

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => mutate();
    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, mutate]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = async () => {
    if (!userId || unreadCount < 1) return;
    await markNotificationsRead(userId);
    mutate();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={"left"}
        className="overflow-y-auto border-gray-800 bg-zinc-950 text-white"
      >
        <header className="flex items-center justify-between border-b border-gray-800 pb-3">
          <SheetTitle className="text-xl font-semibold text-white">
            Notifications
          </SheetTitle>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount < 1}
            className="text-xs font-medium text-blue-500 transition-colors hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all as read
          </button>
        </header>
        {notifications.length < 1 ? (
          <p className="py-10 text-center text-sm text-white/50">
            No notifications yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-1 pt-3">
            {notifications.map((notification) => {
              const Icon = NOTIFICATION_ICON[notification.type];
              return (
                <li key={notification.id}>
                  <Link
                    href={
                      notification.post_id
                        ? `/post/${notification.post_id}`
                        : `/profile/${notification.actor_id}?tab=posts`
                    }
                    className={cn(
                      "flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/5",
                      !notification.is_read && "bg-white/5",
                    )}
                  >
                    <Image
                      className="size-10 min-w-10 rounded-full border border-gray-700 object-cover"
                      src={notification.actor_image}
                      width={40}
                      height={40}
                      alt={notification.actor_username}
                      placeholder={blurDataURL(40, 40)}
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold capitalize">
                          {notification.actor_username}
                        </span>{" "}
                        {NOTIFICATION_MESSAGE[notification.type]}
                      </p>
                      <span className="text-xs text-white/40">
                        {formatMessageTimestamp(notification.created_at)}
                      </span>
                    </div>
                    <Icon size={16} className="shrink-0 text-white/40" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
