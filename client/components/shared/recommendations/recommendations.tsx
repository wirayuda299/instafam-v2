import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import dynamic from "next/dynamic";

import { shimmer, toBase64 } from "@/utils/image-loader";
import { showUsers } from "@/helper/users";
import UserListItem from "./user-list-item";

const AllUsers = dynamic(() => import("./all-users"), { ssr: false });

export default async function Recommendations() {
  const userSession = await currentUser();

  const users = await showUsers(userSession?.id!);

  return (
    <aside className="sticky top-0 hidden w-full max-w-[350px] p-4 lg:block">
      <header className="flex items-center gap-3 pb-3">
        <Image
          src={userSession?.imageUrl!}
          loading="lazy"
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(45, 45))}`}
          width={45}
          height={45}
          alt="user"
          className="size-12 min-w-12 rounded-full object-cover xl:size-14 xl:min-w-14"
        />
        <div>
          <p className="prose prose-sm font-semibold capitalize text-white lg:prose-lg">
            {userSession?.username}
          </p>
          <p className="prose prose-base text-white">{userSession?.fullName}</p>
        </div>
      </header>
      <div className="pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-500">
            Suggested for you
          </h3>
          <AllUsers />
        </div>
        <div className="flex flex-col gap-5 divide-y divide-gray-500/50 pt-5">
          {users?.map((user) => (
            <UserListItem
              user={user}
              userSessionId={userSession?.id!}
              key={user?.id}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
