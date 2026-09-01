"use client";

import { useState } from "react";

const limit = 80;

export default function Captions({ captions }: { captions: string }) {
  const [isExpand, setIsExpand] = useState(false);

  const expandCaption = () => setIsExpand((prev) => !prev);

  const expandableCaptions =
    captions.length >= limit && !isExpand
      ? captions.substring(0, limit) + "..."
      : captions;

  return (
    <div className="flex flex-wrap items-center gap-1">
      <p
        data-testid="captions"
        className="max-w-fit text-sm text-wrap break-words break-all"
      >
        {expandableCaptions}
      </p>
      {captions.length >= limit || isExpand ? (
        <button
          data-testid="more-btn"
          name="more"
          title="more"
          className="text-sm text-white/50 transition-colors hover:text-white"
          onClick={expandCaption}
        >
          {isExpand ? "hide" : "more"}
        </button>
      ) : null}
    </div>
  );
}
