"use client";

import { Check, Pencil, Reply, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ConversationMessage } from "@/types";
import { formatMessageTimestamp } from "@/utils/date";
import { blurDataURL } from "@/utils/image-loader";
import { useSocketContext } from "@/context/socket";

type Props = {
  selectMessage: (message: ConversationMessage | null) => void;
  messages: ConversationMessage[];
  userId: string;
  c: ConversationMessage;
};

export default function ChatItem({
  selectMessage,
  c,
  userId,
  messages,
}: Props) {
  const params = useParams();
  const recipientId = params.id as string;
  const { socket } = useSocketContext();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(c.message);

  const repliedMessage =
    c.parent_id !== null
      ? messages.find((message) => message.id === c.parent_id)
      : null;

  const wasEdited = c.updated_at && c.created_at !== c.updated_at;

  const highlightMessage = (messageId: string) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.classList.add("highlight");
      element.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        element.classList.remove("highlight");
      }, 2000);
    }
  };

  const startEditing = () => {
    setDraft(c.message);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!socket || !draft.trim()) return;

    socket.emit("edit_message", {
      userId,
      messageId: c.id,
      content: draft.trim(),
      recipientId,
    });
    setIsEditing(false);
  };

  return (
    <li
      className={cn(
        "group flex gap-3",
        c.author === userId ? "self-end" : "self-start",
      )}
    >
      {c.author !== userId && c.profile_image && (
        <Image
          src={c.profile_image}
          width={40}
          height={40}
          alt="user"
          loading="lazy"
          placeholder={blurDataURL(45, 45)}
          className="h-8 w-8 rounded-full object-cover"
        />
      )}

      <div>
        <div
          className={cn(
            "group flex",
            c.author !== userId ? "flex-row-reverse" : "flex-row",
          )}
        >
          <div className="flex items-center gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              name="reply"
              title="reply"
              onClick={() => selectMessage(c)}
              className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Reply size={18} />
            </button>
            {c.author === userId && !isEditing && (
              <button
                name="edit"
                title="edit"
                onClick={startEditing}
                className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>

          <div className="w-full">
            {repliedMessage && (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  highlightMessage(
                    repliedMessage.parent_id
                      ? repliedMessage.parent_id
                      : repliedMessage.id,
                  );
                }}
                href={`#${repliedMessage?.parent_id ? repliedMessage.parent_id : repliedMessage.id}`}
                className="flex max-w-[150px]! items-center gap-1 truncate p-1 text-left text-xs text-nowrap text-gray-500 transition-colors hover:text-gray-300"
              >
                Replying to{" "}
                <span className="min-w-fit text-nowrap capitalize">
                  {repliedMessage.username}
                </span>{" "}
                {repliedMessage.message}
              </a>
            )}
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  className="bg-black-1/50 w-full max-w-xs rounded-xl px-3 py-2 text-sm text-white focus-visible:outline-hidden"
                />
                <button
                  name="save"
                  title="save"
                  onClick={saveEdit}
                  className="shrink-0 text-blue-500 transition-colors hover:text-blue-400"
                >
                  <Check size={18} />
                </button>
                <button
                  name="cancel"
                  title="cancel"
                  onClick={() => setIsEditing(false)}
                  className="shrink-0 text-red-500 transition-colors hover:text-red-400"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <p
                id={c.parent_id ? c.parent_id : c.id}
                className={cn(
                  "w-full max-w-xs rounded-xl bg-blue-600 px-3 py-2 break-words text-white",
                  c.author === userId ? "bg-blue-600" : "bg-black-1/50",
                )}
              >
                {c.message}
              </p>
            )}
            <p className="pt-2 text-xs opacity-0 group-hover:opacity-60">
              {formatMessageTimestamp(c.created_at)}
              {wasEdited && " · edited"}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
