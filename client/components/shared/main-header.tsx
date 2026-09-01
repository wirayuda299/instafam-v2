import { Camera, Heart, MessageCircleHeart } from "lucide-react";
import Link from "next/link";

import Notifications from "./sidebar/notifications";

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 max-h-14 w-full items-center justify-between border-b border-gray-800 bg-zinc-950/90 px-3 backdrop-blur-xl md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-fuchsia-600 text-white">
          <Camera size={16} strokeWidth={2.5} />
        </span>
        <h1 className="text-xl font-semibold text-white">Instafam</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Notifications>
          <button
            aria-label="notifications"
            className="text-white/70 transition-colors hover:text-white"
          >
            <Heart />
          </button>
        </Notifications>
        <Link
          href="/messages"
          aria-label="messages"
          className="text-white/70 transition-colors hover:text-white"
        >
          <MessageCircleHeart />
        </Link>
      </div>
    </header>
  );
}
