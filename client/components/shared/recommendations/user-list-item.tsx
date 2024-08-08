import Image from "next/image";

import { User } from "@/types";
import { shimmer, toBase64 } from "@/utils/image-loader";
import FollowButton from "../post-card/follow-button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = { user: User; userSessionId: string; styles?: string };

export default function UserListItem({ user, userSessionId, styles }: Props) {
  return (
    <div
      key={user?.id}
      className={cn("flex items-center justify-between pt-2", styles)}
    >
      <div className="flex items-center gap-3">
        <Image
          src={user?.profile_image}
          width={45}
          height={45}
          alt="user"
          loading="lazy"
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(45, 45))}`}
          className="size-12 min-w-12 rounded-full object-cover"
        />
        <div>
          <Link
            href={`/profile/${user?.id}?tab=posts`}
            className="prose-base font-semibold capitalize text-white lg:prose-lg"
          >
            {user?.username}
          </Link>
          <p className="text-sm text-gray-500/55">Suggested for you</p>
        </div>
      </div>
      <FollowButton
        userToFollow={user?.id!}
        userId={userSessionId}
        styles="bg-transparent text-blue-700 w-min"
      />
    </div>
  );
}
