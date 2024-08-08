"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { Grid, Bookmark } from "lucide-react";

export default function ProfileTab() {
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<HTMLButtonElement | null>(null);

  const handleChangeActiveTab = (tab: HTMLButtonElement) => {
    setActiveTab(tab);
    router.push(`?tab=${tab.title}`);
  };

  const updateStyles = useCallback(() => {
    if (activeTab && lineRef.current) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = activeTab.parentElement!.getBoundingClientRect();
      const leftPosition = tabRect.left - containerRect.left;
      lineRef.current.style.left = `${leftPosition}px`;
    }
  }, [activeTab]);

  useEffect(() => {
    const activeRef = tab === "posts" ? ref1.current : ref2.current;

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

  return (
    <div className="relative mx-auto flex max-w-screen-md items-center justify-center gap-10 p-3">
      <div
        ref={lineRef}
        className="ease absolute top-0 h-px w-[71px] rounded-full bg-white transition-all duration-300"
      ></div>
      <button
        ref={ref1}
        title="posts"
        name="posts"
        onClick={() => handleChangeActiveTab(ref1.current!)}
        className="flex items-center gap-2"
      >
        <Grid /> <span className="font-medium">Posts</span>
      </button>
      <button
        ref={ref2}
        title="saved"
        name="saved"
        onClick={() => handleChangeActiveTab(ref2.current!)}
        className="flex items-center gap-2"
      >
        <Bookmark /> <span className="font-medium">Saved</span>
      </button>
    </div>
  );
}
