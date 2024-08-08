import { notFound } from "next/navigation";
import { Cog, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { shimmer, toBase64 } from "@/utils/image-loader";
import ProfileTab from "@/components/profile/tab";
import { getSavedPosts, getUserPosts } from "@/helper/posts";
import { getUser, getUserFollowers, getUserFollowing } from "@/helper/users";
import LoadMore from "@/components/load-more/posts";
import { currentUser } from "@clerk/nextjs/server";
import FollowButton from "@/components/shared/post-card/follow-button";

type Props = {
  params: { id: string };
  searchParams: { tab: "saved" | "posts" };
};

export default async function UserProfile({ searchParams, params }: Props) {
  const userSession = await currentUser();

  const [user, { posts, totalPosts }, savedPosts, followers, following] =
    await Promise.all([
      getUser(params.id),
      getUserPosts(params?.id),
      getSavedPosts(params?.id),
      getUserFollowers(params.id),
      getUserFollowing(params.id),
    ]);

  if (!user) {
    notFound();
  }

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
              {userSession?.id === params.id ? (
                <>
                  <Button
                    size={"sm"}
                    className="bg-black-1/50 hover:bg-black-1/60"
                  >
                    Edit Profile
                  </Button>
                  <button className="bg-black-1/50 hover:bg-black-1/60">
                    <Cog />
                  </button>
                </>
              ) : (
                <>
                  <FollowButton
                    userId={userSession?.id!}
                    userToFollow={params.id}
                    styles="w-min bg-blue-600 py-1 px-3 rounded-md font-semibold"
                  />
                  <Link href={`/messages/${params.id}`}>
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
            <p>User bio</p>
          </div>
        </header>
      </div>
      <ProfileTab />
      <Suspense
        fallback={<p className="text-white">Loading...</p>}
        key={searchParams.tab}
      >
        <div className="flex flex-wrap gap-3">
          {searchParams.tab === "posts" ? (
            <>
              {posts?.map((post) => (
                <Link
                  href={`/post/${post.post_id}`}
                  key={post.post_id}
                  className="block min-w-[300px]"
                >
                  <Image
                    className="aspect-square h-full max-h-[300px] w-full max-w-[300px] rounded-lg border border-gray-600 object-cover object-center"
                    sizes="400px"
                    src={post.media_url}
                    priority={true}
                    loading={"eager"}
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`}
                    width={500}
                    height={500}
                    alt="attachment"
                  />
                </Link>
              ))}

              <LoadMore
                totalPosts={totalPosts}
                type="profile"
                prevPosts={posts}
              />
            </>
          ) : savedPosts.length > 0 ? (
            savedPosts?.map((post) => (
              <Link href={`/post/${post.post_id}`} key={post.post_id}>
                <Image
                  className="aspect-square h-full max-h-[300px] w-full max-w-[300px] rounded-lg border border-gray-600 object-cover object-center"
                  sizes="400px"
                  src={post.media_url}
                  priority={true}
                  loading={"eager"}
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 400))}`}
                  width={500}
                  height={500}
                  alt="attachment"
                />
              </Link>
            ))
          ) : (
            <p>Nothing here</p>
          )}
        </div>
      </Suspense>
    </main>
  );
}
