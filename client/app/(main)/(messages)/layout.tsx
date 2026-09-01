import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { currentUser, auth } from "@clerk/nextjs/server";

import { blurDataURL } from "@/utils/image-loader";

import { getConversation } from "@/helper/conversations";
import NewChat from "@/components/messages/new-chat";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Message ",
};

export default async function MessagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  await auth.protect();
  const user = await currentUser();

  if (!user) return null;
  const conversations = await getConversation(user?.id);

  return (
    <div className="flex h-full max-h-screen w-full overflow-hidden">
      <aside className="border-black-1 min-h-dvh w-full max-w-[250px] border-r p-2 max-md:max-w-full lg:min-h-screen">
        <header className="border-black-1 w-full space-y-3 border-b px-1 py-2">
          <div className="flex w-full items-center justify-between">
            <h2 className="font-semibold capitalize">{user?.username}</h2>
            <NewChat />
          </div>
        </header>
        <ul className="mt-4 flex h-full flex-col gap-5 overflow-y-auto pb-36">
          {conversations?.map((c) => (
            <Link
              role="listitem"
              href={`/messages/${user?.id === c.senderId ? c.recipientId : c.senderId}?conversationId=${c.conversationId}`}
              key={c.conversationId}
              className="hover:bg-black-1/30 flex items-center gap-3 rounded-md p-1"
            >
              <Image
                src={
                  c?.senderId === user?.id ? c?.recipientImage : c?.senderImage
                }
                width={45}
                height={45}
                alt="user"
                loading="lazy"
                placeholder={blurDataURL(45, 45)}
                className="size-12 min-w-12 rounded-full object-cover"
              />
              <p className="text-sm font-semibold">
                {c?.senderId === user?.id
                  ? c?.recipientUsername
                  : c?.senderUsername}
              </p>
            </Link>
          ))}
        </ul>
      </aside>
      {children}
    </div>
  );
}
