import { useAuth } from "@clerk/nextjs";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useSocketContext } from "@/context/socket";
import { ConversationMessage } from "@/types";
import { X } from "lucide-react";

const schema = z.object({
  message: z.string().min(1, "Please add message").max(1000),
});

type ChatFormSchema = z.infer<typeof schema>;

type Props = {
  memberId: string;
  conversationId: string;
  reloadMessage: () => void;
  selectedMessage: ConversationMessage | null;
  handleSelectedMessage: (message: ConversationMessage | null) => void;
};

function ChatForm({
  memberId,
  conversationId,
  selectedMessage,
  reloadMessage,
  handleSelectedMessage,
}: Props) {
  const form = useForm<ChatFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
    },
  });
  const { userId } = useAuth();
  const { socket } = useSocketContext();

  const handleCreateOrSendMessage = (data: ChatFormSchema) => {
    try {
      if (!socket || !userId) return;

      const values = {
        conversationId,
        message: data.message,
        userId: userId!,
        image_url: "",
        image_asset_id: "",
        recipient_id: memberId,
        parent_id: selectedMessage ? selectedMessage.id : null,
      };
      socket?.emit("send_message", values);

      reloadMessage();

      if (selectedMessage) {
        handleSelectedMessage(null);
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to send message");
    } finally {
      form.reset({ message: "" });
    }
  };

  return (
    <div className="sticky bottom-0 right-0 min-h-14 w-full backdrop-blur">
      {selectedMessage && (
        <p className="relative max-w-xs truncate p-2 text-sm text-gray-500">
          Replying to {selectedMessage?.username} {selectedMessage?.message}{" "}
          <span
            onClick={() => handleSelectedMessage(null)}
            title="Cancel"
            className="absolute right-0 top-0"
          >
            <X size={18} className="text-red-600" />{" "}
          </span>
        </p>
      )}
      <Form {...form}>
        <form
          className="flex h-14 w-full items-center bg-black-1/50 px-5"
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
                    className="w-full min-w-full border-none bg-transparent text-sm focus-visible:outline-none"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default memo(ChatForm);
