import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";

import ProfileTab from "@/components/profile/tab";
import FollowButton from "@/components/shared/post-card/follow-button";
import UserSetting from "@/components/profile/user-settings";
const SavedPosts = dynamic(() => import("@/components/profile/SavedPosts"));
const UserPosts = dynamic(() => import("@/components/profile/UserPosts"))

import { shimmer, toBase64 } from "@/utils/image-loader";
import { getUser, getUserFollowers, getUserFollowing } from "@/helper/users";
import { getUserPosts } from "@/helper/posts";
import Bio from "@/components/profile/Bio";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: "mention" | "saved" | "posts" | "draft" }>;
};

export default async function UserProfile({ searchParams, params }: Props) {
  const userSession = await currentUser();
  const id = (await params).id
  const tab = (await searchParams).tab
  const user = await getUser(id);
  if (!user) notFound();

  const [followers, following, { posts, totalPosts }] = await Promise.all([
    getUserFollowers(id),
    getUserFollowing(id),
    getUserPosts(id, tab === "draft" ? false : true),
  ]);

  return (
    <main className="no-scrollbar max-h-screen min-h-screen overflow-y-auto p-5">
      <div className="max-h-64 min-h-64 w-full border-b border-black-1 p-2 max-sm:max-h-max md:p-5">
        <header className="mx-auto grid h-full w-full max-w-screen-sm grid-cols-2 items-center max-sm:grid-cols-1">
          <Image
            className="size-36 rounded-full"
            loading="lazy"
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(50, 50))}`}
            src={user?.profile_image ?? "/next.svg"}
            width={150}
            height={150}
            alt="user"
          />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-5">
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              {userSession?.id === id ? (
                <>
                  <UserSetting
                    settings={user.settings}
                    userId={id}
                    userSessionId={userSession?.id}
                  />
                </>
              ) : (
                <>
                  <FollowButton
                    userId={userSession?.id!}
                    userToFollow={id}
                    styles="w-min bg-blue-600 py-1 px-3 rounded-md font-semibold"
                  />
                  <Link href={`/messages/${id}`}>
                    <MessageCircle />
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-10">
              <p>
                <span className="font-semibold">{totalPosts}</span> Posts
              </p>
              <p>
                <span className="font-semibold">{followers.length}</span>{" "}
                Followers
              </p>
              <p>
                <span className="font-semibold">{following.length}</span>{" "}
                Following
              </p>
            </div>
            <p className="text-lg font-semibold">{user?.username}</p>
            {userSession?.id === user.id && (
              <Bio bio={user.bio} userId={id} />
            )}
          </div>
        </header>
      </div>
      <div className="overflow-x-auto">
        <ProfileTab
          userSession={userSession?.id!}
          userId={id}
          settings={user.settings}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {tab === "posts" && (
          <Suspense fallback={"Loading posts..."} key={tab}>
            <UserPosts totalPosts={totalPosts} posts={posts} />
          </Suspense>
        )}

        {tab === "saved" && (
          <Suspense
            fallback={"Loading saved posts..."}
            key={tab}
          >
            <SavedPosts userId={id} />
          </Suspense>
        )}
        {tab === "draft" && (
          <Suspense
            fallback={"Loading draft posts..."}
            key={tab}
          >
            <UserPosts totalPosts={totalPosts} posts={posts} />
          </Suspense>
        )}
        {tab === "mention" && <p>mention</p>}
      </div>
    </main>
  );
}
