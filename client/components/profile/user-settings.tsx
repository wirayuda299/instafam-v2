"use client";

import { Cog, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { Switch } from "@/components/ui/switch";
import { updateSettingSchema, UpdateSettingSchema } from "@/validation";

type Props = {
  userId: string;
  userSessionId: string;
  settings: UpdateSettingSchema;
};

export default function UserSetting({
  userId,
  settings,
  userSessionId,
}: Props) {
  const form = useForm<UpdateSettingSchema>({
    resolver: zodResolver(updateSettingSchema),
    defaultValues: {
      show_draft_posts: settings.show_draft_posts,
      show_mention: settings.show_mention,
      show_saved_post: settings.show_saved_post,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleUpdateProfile = async (data: UpdateSettingSchema) => {
    try {
      const { updateUserSetting } = await import("@/helper/users");
      await updateUserSetting(
        userId,
        userSessionId,
        data.show_mention,
        data.show_saved_post,
        data.show_draft_posts,
        window.location.pathname,
      );
    } catch (e) {
      toast.error((e as Error).message || "Failed to update setting");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-white/60 transition-colors hover:text-white"
          title="Setting"
          name="setting"
        >
          <Cog />
        </button>
      </DialogTrigger>
      <DialogContent className="border border-gray-800 bg-zinc-950 p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
            <DialogTitle className="border-b border-gray-800 py-3 text-center text-lg font-semibold text-white">
              Settings
            </DialogTitle>
            <FormField
              control={form.control}
              name="show_mention"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between p-3 transition-colors hover:bg-white/5">
                  <Label>Show mention</Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="show_saved_post"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between p-3 transition-colors hover:bg-white/5">
                  <Label>Show saved posts</Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="show_draft_posts"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between p-3 transition-colors hover:bg-white/5">
                  <Label>Show draft posts</Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <button
              name="save"
              title="save"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-b-md bg-blue-600 p-2.5 font-medium transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Save
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
