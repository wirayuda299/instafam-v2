"use client";

import { useState } from "react";

import { Post, User } from "@/types";
import ProfileTab, { ProfileTabName } from "./tab";
import PostCardImage from "../shared/post-card-image";
import LoadMore from "../load-more/posts";

type Props = {
  userId: string;
  userSession: string;
  settings: Pick<User, "settings">["settings"];
  initialTab: ProfileTabName;
  posts: Post[];
  totalPosts: number;
  draftPosts: Post[];
  draftTotalPosts: number;
  savedPosts: Post[];
};

function PostsGrid({
  posts,
  totalPosts,
  userId,
  published,
}: {
  posts: Post[];
  totalPosts: number;
  userId: string;
  published: boolean;
}) {
  if (posts.length < 1) {
    return (
      <p className="w-full py-10 text-center text-sm text-white/50">
        No posts yet.
      </p>
    );
  }

  return (
    <>
      {posts.map((post, i) => (
        <PostCardImage key={post.post_id} post={post} priority={i < 6} />
      ))}
      <LoadMore
        totalPosts={totalPosts}
        type="profile"
        prevPosts={posts}
        userId={userId}
        published={published}
      />
    </>
  );
}

export default function ProfileBody({
  userId,
  userSession,
  settings,
  initialTab,
  posts,
  totalPosts,
  draftPosts,
  draftTotalPosts,
  savedPosts,
}: Props) {
  const [tab, setTab] = useState<ProfileTabName>(initialTab);

  const handleTabChange = (next: ProfileTabName) => {
    if (next === tab) return;
    setTab(next);
    window.history.replaceState(null, "", `?tab=${next}`);
  };

  return (
    <>
      <div className="overflow-x-auto border-b border-gray-800">
        <ProfileTab
          userSession={userSession}
          userId={userId}
          settings={settings}
          tab={tab}
          onTabChange={handleTabChange}
        />
      </div>
      <div className="flex flex-wrap gap-3 p-3 md:p-4">
        {tab === "posts" && (
          <PostsGrid
            key="posts"
            posts={posts}
            totalPosts={totalPosts}
            userId={userId}
            published={true}
          />
        )}
        {tab === "draft" && (
          <PostsGrid
            key="draft"
            posts={draftPosts}
            totalPosts={draftTotalPosts}
            userId={userId}
            published={false}
          />
        )}
        {tab === "saved" &&
          (savedPosts.length > 0 ? (
            savedPosts.map((post, i) => (
              <PostCardImage post={post} key={post.post_id} priority={i < 6} />
            ))
          ) : (
            <p className="w-full py-10 text-center text-sm text-white/50">
              No saved posts yet.
            </p>
          ))}
        {tab === "mention" && (
          <p className="w-full py-10 text-center text-sm text-white/50">
            No mentions yet.
          </p>
        )}
      </div>
    </>
  );
}
