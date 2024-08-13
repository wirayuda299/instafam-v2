"use client";

import { useSocketContext } from "@/context/socket";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import ChatForm from "./chat-form";

import { ConversationMessage } from "@/types";
import ChatItem from "./chat-item";

export default function ChatList() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const params = useParams();
  const [selectedMessage, setSelectedMessage] =
    useState<ConversationMessage | null>(null);
  const { socket } = useSocketContext();
  const searchParams = useSearchParams();

  const conversationId = searchParams.get("conversationId") as string;

  const reloadPersonalMessage = useCallback(() => {
    if (!socket) return;

    socket?.emit("get_messages", {
      userId: params.id,
    });
  }, [params.id, socket]);

  useEffect(() => {
    if (!socket) return;

    setLoading(true);
    reloadPersonalMessage();

    const handleMessages = (messages: ConversationMessage[]) => {
      setMessages(messages);
      setLoading(false);
    };

    socket?.on("set_messages", handleMessages);

    return () => {
      socket?.off("set_messages", handleMessages);
    };
  }, [params.id, socket, reloadPersonalMessage]);

  const handleSelectMessage = useCallback(
    (message: ConversationMessage | null) => setSelectedMessage(message),
    [],
  );

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
              <ChatItem
                messages={messages}
                selectMessage={handleSelectMessage}
                c={c}
                key={c.id}
                userId={userId!}
              />
            ))}
      </ol>
      <ChatForm
        handleSelectedMessage={handleSelectMessage}
        selectedMessage={selectedMessage}
        memberId={params.id as string}
        conversationId={conversationId || ""}
        reloadMessage={reloadPersonalMessage}
      />
    </>
  );
}
