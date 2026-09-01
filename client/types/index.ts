export type Post = {
  post_id: string;
  author_id: string;
  author_name: string;
  profile_image: string;
  captions: string;
  media_url: string;
  media_asset_id: string;
  created_at: string;
  published: boolean;
  likes: Like[];
};

export type CloudinaryResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string; // ISO date string
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  api_key: string;
};

export type UserConversation = {
  conversationId: string;
  conversationCreatedAt: string;
  senderId: string;
  senderUsername: string;
  senderImage: string;
  recipientId: string;
  recipientUsername: string;
  recipientImage: string;
};

export type Like = {
  liked_by: string;
  postId: string;
};

export interface Comment {
  comment_id: string;
  author: string;
  comment: string;
  created_at: string;
  updated_at: string;
  username: string;
  profile_image: string;
  post_id: string;
  likes: {
    comment_id: string;
    liked_by: string;
  }[];
}

export type User = {
  id: string;
  username: string;
  email: string;
  created_at: string;
  profile_image: string;
  bio: string;
  settings: {
    userid: string;
    show_saved_post: boolean;
    show_mention: boolean;
    show_draft_posts: boolean;
  };
};
export type ConversationMessage = {
  id: string;
  message: string;
  attachment_url: string;
  attachment_id: string;
  parent_id: string | null;
  username: string;
  profile_image: string;
  author: string;
  level: number;
  created_at: string;
  updated_at: string;
};

export type NotificationType = "like" | "comment" | "follow";

export type Notification = {
  id: string;
  type: NotificationType;
  post_id: string | null;
  is_read: boolean;
  created_at: string;
  actor_id: string;
  actor_username: string;
  actor_image: string;
};
