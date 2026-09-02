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
import { cn } from "@/lib/utils";

export default function CommentForm({
  postId,
  styles,
}: {
  postId: string;
  styles?: string;
}) {
  const form = useForm<AddCommentSchema>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleCreateComment = async (value: AddCommentSchema) => {
    try {
      const { createComment } = await import("@/actions/comments");
      const res = await createComment(postId, value.comment);

      if (res && "errors" in res) {
        handleError(res, "Failed to publish comment");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      form.reset();
    }
  };

  const isSubmitting = form.formState.isSubmitting;
  const canSubmit = form.watch("comment")?.trim().length > 0;

  return (
    <Form {...form}>
      <form
        className={cn(
          "flex items-center gap-2 border-t border-gray-800 pt-2",
          styles,
        )}
        onSubmit={form.handleSubmit(handleCreateComment)}
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <input
                  autoComplete="off"
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-sm placeholder:text-white/40 focus-visible:outline-hidden disabled:opacity-50"
                  type="text"
                  {...field}
                  placeholder="Add a comment..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="shrink-0 text-sm font-semibold text-blue-500 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </Form>
  );
}
