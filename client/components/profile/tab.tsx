"use client";

import { useRef, useCallback, useEffect } from "react";
import { Grid, Bookmark, LockKeyhole, AtSign } from "lucide-react";

import { User } from "@/types";
import { cn } from "@/lib/utils";

export type ProfileTabName = "posts" | "saved" | "draft" | "mention";

type Props = {
  userId: string;
  settings: Pick<User, "settings">["settings"];
  userSession: string;
  tab: ProfileTabName;
  onTabChange: (tab: ProfileTabName) => void;
};

export default function ProfileTab({
  settings,
  userSession,
  userId,
  tab,
  onTabChange,
}: Props) {
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const ref3 = useRef<HTMLButtonElement>(null);
  const ref4 = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const refForTab = useCallback((name: ProfileTabName) => {
    switch (name) {
      case "posts":
        return ref1;
      case "saved":
        return ref2;
      case "draft":
        return ref3;
      case "mention":
        return ref4;
    }
  }, []);

  const updateStyles = useCallback(() => {
    const activeTab = refForTab(tab).current;
    if (activeTab && lineRef.current) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = activeTab.parentElement!.getBoundingClientRect();
      lineRef.current.style.left = `${tabRect.left - containerRect.left}px`;
      lineRef.current.style.width = `${activeTab.clientWidth}px`;
    }
  }, [tab, refForTab]);

  useEffect(() => {
    updateStyles();
    window.addEventListener("resize", updateStyles);
    return () => window.removeEventListener("resize", updateStyles);
  }, [updateStyles]);

  const tabClass = (name: ProfileTabName) =>
    cn(
      "flex items-center gap-2 pb-3 transition-colors",
      tab === name ? "text-white" : "text-white/50 hover:text-white/80",
    );

  return (
    <div className="relative mx-auto flex max-w-(--breakpoint-md) min-w-fit items-center justify-center gap-10 p-3">
      <div
        ref={lineRef}
        className="ease absolute bottom-0 h-0.5 w-[71px] rounded-full bg-white transition-all duration-300"
      ></div>
      <button
        ref={ref1}
        title="posts"
        name="posts"
        onClick={() => onTabChange("posts")}
        className={tabClass("posts")}
      >
        <Grid /> <span className="font-medium">Posts</span>
      </button>
      {(userId === userSession || settings.show_saved_post) && (
        <button
          ref={ref2}
          title="saved"
          name="saved"
          onClick={() => onTabChange("saved")}
          className={tabClass("saved")}
        >
          <Bookmark /> <span className="font-medium">Saved</span>
        </button>
      )}
      {(userId === userSession || settings.show_draft_posts) && (
        <button
          ref={ref3}
          title="draft"
          name="draft"
          onClick={() => onTabChange("draft")}
          className={tabClass("draft")}
        >
          <LockKeyhole />
          <span className="font-medium">Draft</span>
        </button>
      )}
      {(userSession === userId || settings.show_mention) && (
        <button
          ref={ref4}
          title="mention"
          name="mention"
          onClick={() => onTabChange("mention")}
          className={tabClass("mention")}
        >
          <AtSign />
          <span className="font-medium">Mention</span>
        </button>
      )}
    </div>
  );
}
