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
  likes: PostLike[];
};

export type PostLike = {
  post_id: string;
  liked_by: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  profile_image: string;
};

export type Comment = {
  comment_id: string;
  author: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  profile_image: string;
  post_id: string;
};

export type NotificationType = 'like' | 'comment' | 'follow';

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
