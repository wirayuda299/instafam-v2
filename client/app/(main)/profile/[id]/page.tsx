import { notFound, redirect } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

import FollowButton from "@/components/shared/post-card/follow-button";
import UserSetting from "@/components/profile/user-settings";
import ProfileBody from "@/components/profile/profile-body";

import { blurDataURL } from "@/utils/image-loader";
import { getUser, getUserFollowers, getUserFollowing } from "@/helper/users";
import { getSavedPosts, getUserPosts } from "@/helper/posts";
import Bio from "@/components/profile/bio";
import { Post } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab: "mention" | "saved" | "posts" | "draft" }>;
};

export const metadata = {
  title: "Profile ",
};

// eslint-disable-next-line @clerk/next/require-auth-protection
export default async function UserProfile({ searchParams, params }: Props) {
  const id = (await params).id;
  const tab = (await searchParams).tab ?? "posts";

  const user = await getUser(id);
  const userSession = await currentUser();

  if (!userSession) {
    redirect("/sign-in");
  }

  if (!user) return notFound();

  const canSeeDraft = userSession.id === id || user.settings.show_draft_posts;
  const canSeeSaved = userSession.id === id || user.settings.show_saved_post;

  const emptyPosts: { posts: Post[]; totalPosts: number } = {
    posts: [],
    totalPosts: 0,
  };

  const [followers, following, { posts, totalPosts }, draft, savedPosts] =
    await Promise.all([
      getUserFollowers(id),
      getUserFollowing(id),
      getUserPosts(id, true),
      canSeeDraft ? getUserPosts(id, false) : Promise.resolve(emptyPosts),
      canSeeSaved
        ? getSavedPosts(id)
        : Promise.resolve<Post[]>([]),
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
                <UserSetting settings={user.settings} userId={id} />
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
      <ProfileBody
        userId={id}
        userSession={userSession.id!}
        settings={user.settings}
        initialTab={tab}
        posts={posts}
        totalPosts={totalPosts}
        draftPosts={draft.posts}
        draftTotalPosts={draft.totalPosts}
        savedPosts={savedPosts}
      />
    </main>
  );
}
