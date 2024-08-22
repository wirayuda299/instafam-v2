import Link from "next/link";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";

import { shimmer, toBase64 } from "@/utils/image-loader";
import { SocketContextProvider } from "@/context/socket";

import { getConversation } from "@/helper/conversations";

export default async function MessagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (!user) return null;
  const conversations = await getConversation(user?.id);

  return (
    <SocketContextProvider>
      <div className="flex h-full max-h-screen w-full overflow-hidden">
        <aside className="min-h-dvh w-full max-w-[250px] border-r border-black-1 p-2 max-md:max-w-full lg:min-h-screen">
          <header className="h-20 w-full space-y-3 p-1">
            <div className="flex w-full items-center justify-between">
              <h2>{user?.username}</h2>
              <button>
                <SquarePen />
              </button>
            </div>
            <div className="flex h-12 w-full items-center justify-between text-base">
              <p className="text-gray-500">Messages</p>
              <button className="font-semibold">Request</button>
            </div>
          </header>
          <ul className="mt-4 flex h-full flex-col gap-5 overflow-y-auto pb-36">
            {conversations?.map((c) => (
              <Link
                role="listitem"
                href={`/messages/${user?.id === c.senderId ? c.recipientId : c.senderId}?conversationId=${c.conversationId}`}
                key={c.conversationId}
                className="flex items-center gap-3 rounded-md p-1 hover:bg-black-1/30"
              >
                <Image
                  src={c.senderId === user?.id ? c.recipientImage : c.senderImage}
                  width={45}
                  height={45}
                  alt="user"
                  loading="lazy"
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(45, 45))}`}
                  className="size-12 min-w-12 rounded-full object-cover"
                />
                <p className="text-sm font-semibold">
                  {c.senderId === user?.id
                    ? c.recipientUsername
                    : c.senderUsername}
                </p>
              </Link>
            ))}
          </ul>
        </aside>
        {children}
      </div>
    </SocketContextProvider>
  );
}
