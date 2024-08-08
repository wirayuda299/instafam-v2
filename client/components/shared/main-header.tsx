import { Heart, MessageCircleHeart } from "lucide-react";

import Notifications from "./sidebar/notifications";

export default function MainHeader() {
  return (
    <header className="sticky top-0 flex h-14 max-h-14 w-full items-center justify-between border-b border-black-1 bg-black px-2 md:hidden">
      <h1 className="text-xl font-semibold">Instafam</h1>
      <div className="flex items-center gap-4">
        <Notifications>
          <button>
            <Heart />
          </button>
        </Notifications>
        <button>
          <MessageCircleHeart />
        </button>
      </div>
    </header>
  );
}
