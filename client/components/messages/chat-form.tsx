import { useAuth } from "@clerk/nextjs";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useSocketContext } from "@/context/socket";

const schema = z.object({
  message: z.string().min(1, "Please add message").max(1000),
});

type ChatFormSchema = z.infer<typeof schema>;
type Props = {
  memberId: string;
  conversationId: string;
  reloadMessage: () => void;
};

function ChatForm({ memberId, conversationId, reloadMessage }: Props) {
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
        parent_id: null
      }
      socket?.emit("send_message", values);

      reloadMessage();
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message || "Failed to send message");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateOrSendMessage)}
        className="sticky bottom-0 right-0 flex h-10 w-full items-center bg-black-1/50 px-5 backdrop-blur"
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
  );
}

export default memo(ChatForm);
