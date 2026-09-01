import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

import { blurDataURL } from "@/utils/image-loader";
import { showUsers } from "@/helper/users";
import UserListItem from "./user-list-item";
import AllUsers from "./all-users";

export default async function Recommendations() {
  const userSession = await currentUser();
  if (!userSession || userSession === null) return null;

  const { users } = await showUsers(userSession?.id!);

  return (
    <aside className="sticky top-0 hidden w-full max-w-[350px] p-4 lg:block">
      <Link
        href={`/profile/${userSession.id}?tab=posts`}
        className="group flex items-center gap-3 pb-3"
      >
        <Image
          src={userSession?.imageUrl!}
          loading="lazy"
          placeholder={blurDataURL(45, 45)}
          width={45}
          height={45}
          alt="user"
          className="size-12 min-w-12 rounded-full border border-gray-700 object-cover xl:size-14 xl:min-w-14"
        />
        <div>
          <p className="prose prose-sm lg:prose-lg font-semibold text-white capitalize transition-colors group-hover:text-white/80">
            {userSession?.username}
          </p>
          <p className="prose prose-base text-white/50">
            {userSession?.fullName}
          </p>
        </div>
      </Link>
      <div className="pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/50">
            Suggested for you
          </h3>
          <AllUsers />
        </div>
        {users && users.length > 0 ? (
          <div className="flex flex-col gap-5 divide-y divide-gray-800 pt-5">
            {users.map((user) => (
              <UserListItem
                user={user}
                userSessionId={userSession?.id!}
                key={user?.id}
              />
            ))}
          </div>
        ) : (
          <p className="pt-5 text-sm text-white/40">
            No suggestions right now.
          </p>
        )}
      </div>
    </aside>
  );
}
