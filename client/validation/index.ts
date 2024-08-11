import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(4, "Username is required").nullable(),
  email: z.string().email("Please add valid email"),
  id: z.string().min(10, "Id is required"),
  image: z.string().url("Please add valid image url").startsWith("https"),
});

export const createPostSchema = z.object({
  captions: z.string().min(1, "Caption is required"),
  media: z.string().url().min(1, "Please add image").startsWith("https"),
  media_asset_id: z.string(),

});

export const addCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "Please add comment")
    .max(500, "Max characters exceed"),
});

export const sendMessageSchema = z.object({
  sendedBy: z.string(),
  conversationId: z.string(),
  message: z.string().min(1, "Please add message"),
  attachmentUrl: z.string(),
  attachmentId: z.string(),
});

export const createConversationSchema = sendMessageSchema.extend({
  createdBy: z.string(),
  memberId: z.string(),
});

export const updateSettingSchema = z.object({
  show_saved_post: z.boolean(),
  show_mention: z.boolean(),
  show_draft_posts: z.boolean(),
})

export type UpdateSettingSchema = z.infer<typeof updateSettingSchema>;
export type SendMessageSchema = z.infer<typeof sendMessageSchema>;
export type CreateConversationSchema = z.infer<typeof createConversationSchema>;
export type AddCommentSchema = z.infer<typeof addCommentSchema>;
export type CreatePostType = z.infer<typeof createPostSchema>;
export type CreateUserType = z.infer<typeof createUserSchema>;
