import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { currentUser, auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";

import ProfileTab from "@/components/profile/tab";
import FollowButton from "@/components/shared/post-card/follow-button";
import UserSetting from "@/components/profile/user-settings";
const SavedPosts = dynamic(() => import("@/components/profile/saved-posts"));
const UserPosts = dynamic(() => import("@/components/profile/user-posts"));

import { blurDataURL } from "@/utils/image-loader";
import { getUser, getUserFollowers, getUserFollowing } from "@/helper/users";
import { getUserPosts } from "@/helper/posts";
import Bio from "@/components/profile/bio";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: "mention" | "saved" | "posts" | "draft" }>;
};

export const metadata = {
  title: "Profile ",
};

function PostsGridSkeleton() {
  return (
    <div className="flex w-full flex-wrap gap-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-black-1/40 max-w-[300px] min-w-36 flex-1 basis-36 animate-pulse rounded-lg border border-gray-800"
          style={{ aspectRatio: "1 / 1" }}
        />
      ))}
    </div>
  );
}

export default async function UserProfile({ searchParams, params }: Props) {
  await auth.protect();
  const id = (await params).id;
  const tab = (await searchParams).tab;
  const user = await getUser(id);
  const userSession = await currentUser();

  if (!userSession || !user) {
    return notFound();
  }

  const [followers, following, { posts, totalPosts }] = await Promise.all([
    getUserFollowers(id),
    getUserFollowing(id),
    getUserPosts(id, tab === "draft" ? false : true),
  ]);

  return (
    <main className="no-scrollbar h-[calc(100dvh-3.5rem)] overflow-y-auto p-5 md:h-screen">
      <div className="max-h-64 min-h-64 w-full border-b border-gray-800 p-2 max-lg:max-h-max md:p-5">
        <header className="mx-auto grid h-full w-full max-w-(--breakpoint-sm) grid-cols-1 items-center gap-4 lg:grid-cols-2">
          <Image
            className="size-36 rounded-full border border-gray-700 object-cover"
            loading="lazy"
            placeholder={blurDataURL(50, 50)}
            src={user?.profile_image ?? "/next.svg"}
            width={150}
            height={150}
            alt="user"
          />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-2xl font-semibold text-white">
                {user?.username}
              </h2>
              {userSession?.id === id ? (
                <UserSetting
                  settings={user.settings}
                  userId={id}
                  userSessionId={userSession?.id}
                />
              ) : (
                <>
                  <FollowButton
                    userId={userSession.id!}
                    userToFollow={id}
                    styles="w-min rounded-md bg-blue-600 px-3 py-1 font-semibold transition-colors hover:bg-blue-700"
                  />
                  <Link
                    href={`/messages/${id}`}
                    aria-label="message"
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    <MessageCircle />
                  </Link>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-6 text-white/80 sm:gap-10">
              <p>
                <span className="font-semibold text-white">{totalPosts}</span>{" "}
                Posts
              </p>
              <p>
                <span className="font-semibold text-white">
                  {followers.length}
                </span>{" "}
                Followers
              </p>
              <p>
                <span className="font-semibold text-white">
                  {following.length}
                </span>{" "}
                Following
              </p>
            </div>
            {userSession?.id === user.id && <Bio bio={user.bio} userId={id} />}
          </div>
        </header>
      </div>
      <div className="overflow-x-auto border-b border-gray-800">
        <ProfileTab
          userSession={userSession.id!}
          userId={id}
          settings={user.settings}
        />
      </div>
      <div className="flex flex-wrap gap-3 p-3 md:p-4">
        {tab === "posts" && (
          <Suspense fallback={<PostsGridSkeleton />} key={tab}>
            <UserPosts totalPosts={totalPosts} posts={posts} />
          </Suspense>
        )}

        {tab === "saved" && (
          <Suspense fallback={<PostsGridSkeleton />} key={tab}>
            <SavedPosts userId={id} />
          </Suspense>
        )}
        {tab === "draft" && (
          <Suspense fallback={<PostsGridSkeleton />} key={tab}>
            <UserPosts totalPosts={totalPosts} posts={posts} />
          </Suspense>
        )}
        {tab === "mention" && (
          <p className="w-full py-10 text-center text-sm text-white/50">
            No mentions yet.
          </p>
        )}
      </div>
    </main>
  );
}
