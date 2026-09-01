"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback } from "react";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useSocketContext } from "@/context/socket";
import { ConversationMessage } from "@/types";
import { SendHorizontal, X } from "lucide-react";

const schema = z.object({
  message: z.string().min(1, "Please add a message").max(1000),
});

type ChatFormSchema = z.infer<typeof schema>;

type Props = {
  memberId: string;
  conversationId: string;
  reloadMessage: () => void;
  selectedMessage: ConversationMessage | null;
  handleSelectedMessage: (message: ConversationMessage | null) => void;
  userId: string;
};

function ChatForm({
  memberId,
  conversationId,
  selectedMessage,
  reloadMessage,
  handleSelectedMessage,
  userId,
}: Props) {
  const form = useForm<ChatFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });
  const { socket } = useSocketContext();

  const handleCreateOrSendMessage = useCallback(
    (data: ChatFormSchema) => {
      if (!socket) {
        toast.error("Socket disconnected");
        return;
      }

      if (!userId) {
        toast.error("Unauthorized");
        return;
      }

      const values = {
        conversationId,
        message: data.message,
        userId,
        image_url: "",
        image_asset_id: "",
        recipient_id: memberId,
        parent_id: selectedMessage ? selectedMessage.id : null,
      };

      try {
        socket.emit("send_message", values);
        reloadMessage();

        if (selectedMessage) handleSelectedMessage(null);

        form.reset({ message: "" });
      } catch (error) {
        toast.error((error as Error).message || "Failed to send message");
      }
    },
    [
      socket,
      userId,
      conversationId,
      memberId,
      selectedMessage,
      reloadMessage,
      handleSelectedMessage,
      form,
    ],
  );

  return (
    <div className="sticky right-0 bottom-0 min-h-14 w-full border-t border-gray-800 bg-zinc-950/90 backdrop-blur-xl">
      {selectedMessage && (
        <p className="relative max-w-xs truncate p-2 text-sm text-gray-500">
          Replying to {selectedMessage?.username}: {selectedMessage?.message}{" "}
          <span
            onClick={() => handleSelectedMessage(null)}
            title="Cancel"
            className="absolute top-0 right-0 cursor-pointer text-red-600 transition-opacity hover:opacity-70"
          >
            <X size={18} />
          </span>
        </p>
      )}
      <Form {...form}>
        <form
          className="flex h-14 w-full items-center gap-3 px-5"
          onSubmit={form.handleSubmit(handleCreateOrSendMessage)}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <input
                    {...field}
                    type="text"
                    placeholder="Send message..."
                    name="message"
                    autoFocus
                    autoComplete="off"
                    className="w-full min-w-full border-none bg-transparent text-sm placeholder:text-white/40 focus-visible:outline-hidden"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <button
            type="submit"
            title="send"
            aria-label="send message"
            disabled={!form.watch("message")?.trim()}
            className="shrink-0 text-white/60 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal size={20} />
          </button>
        </form>
      </Form>
    </div>
  );
}

export default memo(ChatForm);
