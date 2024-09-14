import Image from "next/image";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { shimmer, toBase64 } from "@/utils/image-loader";
import ChatList from "@/components/messages/chat-list";
import { getUser } from "@/helper/users";

type Props = {
  params: { id: string };
};

export default async function MessageDetail({ params }: Props) {
  const user = await getUser(params?.id);

  return (
    <div className="no-scrollbar fixed left-0 z-50 h-full max-h-screen w-full overflow-y-auto bg-black md:static">
      <header className="sticky top-0 flex h-20 w-full items-center justify-between border-b border-black-1 bg-black p-5">
        <div className="flex items-center gap-3 rounded-md p-1">
          <Image
            src={user?.profile_image}
            width={45}
            height={45}
            alt="user"
            loading="lazy"
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(45, 45))}`}
            className="size-12 min-w-12 rounded-full object-cover"
          />
          <p className="text-sm font-semibold">{user?.username} </p>
        </div>
        <Link href={"/messages"}>
          <LogOut />
        </Link>
      </header>
      <ChatList />
    </div>
  );
}
