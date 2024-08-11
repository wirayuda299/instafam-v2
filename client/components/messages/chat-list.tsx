"use client";

import { useSocketContext } from "@/context/socket";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { shimmer, toBase64 } from "@/utils/image-loader";
import ChatForm from "./chat-form";

import { formatMessageTimestamp } from "@/utils/date";
import { ConversationMessage } from "@/types";


export default function ChatList() {
  const searchParams = useSearchParams();
  const { userId } = useAuth();
   const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const params = useParams();
 const { socket } = useSocketContext();

  const conversationId = searchParams.get("conversationId") as string;

  const reloadPersonalMessage = () => {
    if (!socket) return;

    socket?.emit("get_messages", {
      userId: params.id,
    });
  }




  useEffect(() => {
    if (!socket) return;

    setLoading(true);
    reloadPersonalMessage();

    const handleMessages = (messages: ConversationMessage[]) => {
      setMessages(messages);
      setLoading(false)
    };

    socket?.on("set_messages", handleMessages);

    return () => {
      socket?.off("get_messages");
      socket?.off("set_messages", handleMessages);
    };
  }, [params.id, socket]);


  return (
    <>
      <ol className="flex min-h-svh flex-col gap-5 p-5">
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-7 w-full max-w-xs animate-pulse rounded-md bg-black-1/50",
                i % 2 === 0 ? "self-end" : "self-start",
              )}
            ></div>
          ))
          : messages.map((c) => (
            <li
              key={c.id}
              className={cn(
                "group flex gap-3",
                c.author === userId ? "self-end" : "self-start",
              )}
            >
              {c.author !== userId && c.profile_image && (
                <Image
                  src={c.profile_image}
                  width={40}
                  height={40}
                  alt="user"
                  loading="lazy"
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(45, 45))}`}
                  className="h-8 w-8 rounded-full object-cover" />
              )}
              <div>
                <p
                  className={cn(
                    "w-full max-w-xs break-words rounded-xl bg-blue-600 px-3 py-2 text-white",
                    c.author === userId ? "bg-blue-600" : "bg-black-50",
                  )}
                >
                  {c.message}
                </p>
                <p className="text-xs opacity-0 group-hover:opacity-100">
                  {formatMessageTimestamp(c.created_at)}
                </p>
              </div>
            </li>
          ))}
      </ol>
      <ChatForm
        memberId={params.id as string}
        conversationId={conversationId || ""}
        reloadMessage={reloadPersonalMessage}
      />
    </>
  );
}
