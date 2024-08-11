"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AddCommentSchema, addCommentSchema } from "@/validation";
import { handleError } from "@/utils/error";

export default function CommentForm({ postId }: { postId: string }) {
  const form = useForm<AddCommentSchema>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleCreateComment = async (value: AddCommentSchema) => {
    try {
      const { createComment } = await import('@/actions/comments')
      const res = await createComment(
        postId,
        value.comment,
        window.location.pathname,
      );

      if (res && "errors" in res) {
        handleError(res, "Failed to publish comment");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form className="pt-2" onSubmit={form.handleSubmit(handleCreateComment)}>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input
                  autoComplete="off"
                  className="w-full bg-transparent text-sm focus-visible:outline-none"
                  type="text"
                  {...field}
                  placeholder="Add a comment..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
