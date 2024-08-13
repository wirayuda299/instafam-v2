import { Reply } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { ConversationMessage } from "@/types";
import { formatMessageTimestamp } from "@/utils/date";
import { shimmer, toBase64 } from "@/utils/image-loader";

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
  const repliedMessage =
    c.parent_id !== null
      ? messages.find((message) => message.id === c.parent_id)
      : null;

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

  return (
    <li

      className={cn(
        "group flex  gap-3 ",
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
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(45, 45))}`}
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
          <div className="flex items-center p-2 opacity-0 group-hover:opacity-100">
            <button name="reply" title="reply" onClick={() => selectMessage(c)}>
              <Reply size={18} />
            </button>
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
                className="flex !max-w-[150px] items-center gap-1 truncate text-nowrap p-1 text-left text-xs text-gray-500"
              >
                Replying to{" "}
                <span className="min-w-fit text-nowrap capitalize">
                  {repliedMessage.username}
                </span>{" "}
                {repliedMessage.message}
              </a>
            )}
            <p
              id={c.parent_id ? c.parent_id : c.id}
              className={cn(
                "w-full max-w-xs break-words rounded-xl bg-blue-600 px-3 py-2 text-white",
                c.author === userId ? "bg-blue-600" : "bg-black-1/50",
              )}
            >
              {c.message}
            </p>
            <p className="pt-2 text-xs opacity-0 group-hover:opacity-60">
              {formatMessageTimestamp(c.created_at)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
