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
  isDraft: z.boolean().default(false)
});

export const addCommentSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  comment: z.string().min(1, 'Please add comment'),
  post_id: z.string().min(1, 'Post id is required'),
});

  //conversationId: '',
  //message: 'ss',
  //userId: 'user_2kM92cZs2T24VqobCz3h2MdBZWp',
  //image_url: '',
  //image_asset_id: '',
  //recipient_id: 'user_2kVnmwE9TqhhUJqHAyWSQ0ahBrs',
  //parent_id: ''
  //

export const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Please add message'),
  image_url: z.string(),
  image_asset_id: z.string().optional(),
  recipient_id: z.string(),
  parent_id:z.string().nullable(),
  userId:z.string()
});


export type SendMessageSchema = z.infer<typeof sendMessageSchema>;

export type AddCommentSchema = z.infer<typeof addCommentSchema>;

export type CreatePostType = z.infer<typeof createPostSchema>;

export type CreateUserType = z.infer<typeof createUserSchema>;
