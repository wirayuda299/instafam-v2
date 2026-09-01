"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  startTransition,
} from "react";
import { Grid, Bookmark, LockKeyhole, AtSign } from "lucide-react";

import { User } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  userId: string;
  settings: Pick<User, "settings">["settings"];
  userSession: string;
};

export default function ProfileTab({ settings, userSession, userId }: Props) {
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const ref3 = useRef<HTMLButtonElement>(null);
  const ref4 = useRef<HTMLButtonElement>(null);

  const lineRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<HTMLButtonElement | null>(
    ref1?.current,
  );

  const handleChangeActiveTab = (tab: HTMLButtonElement) => {
    setActiveTab(tab);
    startTransition(() => {
      router.push(`?tab=${tab.title}`);
    });
  };

  const updateStyles = useCallback(() => {
    if (activeTab && lineRef.current) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = activeTab.parentElement!.getBoundingClientRect();
      const leftPosition = tabRect.left - containerRect.left;
      lineRef.current.style.left = `${leftPosition}px`;
      lineRef.current.style.width = activeTab.clientWidth + "px";
    }
  }, [activeTab]);

  useEffect(() => {
    let activeRef;

    switch (tab) {
      case "posts":
        activeRef = ref1.current;
        break;
      case "saved":
        activeRef = ref2.current;
        break;
      case "draft":
        activeRef = ref3.current;
        break;
      case "mention":
        activeRef = ref4.current;
        break;
      default:
        activeRef = ref1.current;
    }
    setActiveTab(activeRef);
  }, [tab]);

  useEffect(() => {
    if (activeTab && lineRef.current) {
      updateStyles();
    }

    window.addEventListener("resize", updateStyles);

    return () => {
      window.removeEventListener("resize", updateStyles);
    };
  }, [activeTab, updateStyles]);

  const activeTabName = tab ?? "posts";
  const tabClass = (name: string) =>
    cn(
      "flex items-center gap-2 pb-3 transition-colors",
      activeTabName === name
        ? "text-white"
        : "text-white/50 hover:text-white/80",
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
        onClick={() => handleChangeActiveTab(ref1.current!)}
        className={tabClass("posts")}
      >
        <Grid /> <span className="font-medium">Posts</span>
      </button>
      {(userId === userSession || settings.show_saved_post) && (
        <button
          ref={ref2}
          title="saved"
          name="saved"
          onClick={() => handleChangeActiveTab(ref2.current!)}
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
          onClick={() => handleChangeActiveTab(ref3.current!)}
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
          onClick={() => handleChangeActiveTab(ref4.current!)}
          className={tabClass("mention")}
        >
          <AtSign />
          <span className="font-medium">Mention</span>
        </button>
      )}
    </div>
  );
}
