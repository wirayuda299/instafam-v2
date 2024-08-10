import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(4, 'Username is required').nullable(),
  email: z.string().email('Please add valid email'),
  id: z.string().min(10, 'Id is required'),
  image: z.string().url('Please add valid image url').startsWith('https'),
});

export const createPostSchema = z.object({
  captions: z.string().min(1, 'Captions is required'),
  media_url: z.string().url().startsWith('https'),
  media_asset_id: z.string(),
  author: z.string(),
});

export const addCommentSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  comment: z.string().min(1, 'Please add comment'),
  post_id: z.string().min(1, 'Post id is required'),
});

export const sendMessageSchema = z.object({
  sendedBy: z.string(),
  conversationId: z.string(),
  message: z.string().min(1, 'Please add message'),
  attachmentUrl: z.string().url().optional().nullable(),
  attachmentId: z.string(),
  parent_id: z.string().nullable(),
  recipient_id: z.string(),
});

export const createConversationSchema = sendMessageSchema.extend({
  members: z.array(z.string()),
  createdBy: z.string(),
});

export type CreateConversationSchema = z.infer<typeof createConversationSchema>;

export type SendMessageSchema = z.infer<typeof sendMessageSchema>;

export type AddCommentSchema = z.infer<typeof addCommentSchema>;

export type CreatePostType = z.infer<typeof createPostSchema>;

export type CreateUserType = z.infer<typeof createUserSchema>;
