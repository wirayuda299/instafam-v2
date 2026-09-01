import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Messages() {
  await auth.protect();
  return (
    <div className="hidden min-h-screen w-full flex-col items-center justify-center gap-3 overflow-y-auto md:flex">
      <Image
        className="aspect-auto size-36 opacity-80 invert"
        src={"/assets/messages/images/chat.png"}
        width={100}
        height={100}
        alt="messages"
      />
      <p className="prose prose-lg font-semibold text-white">Your messages</p>
      <p className="text-sm text-white/50">
        Select a conversation to start chatting.
      </p>
    </div>
  );
}
