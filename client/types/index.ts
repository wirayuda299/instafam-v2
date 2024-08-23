export type Post = {
  post_id: string;
  author_id: string;
  author_name: string;
  profile_image: string;
  captions: string;
  media_url: string;
  media_asset_id: string;
  created_at: string;
  likes: Like[];
};

export type Like = {
  liked_by: string;
  postId: string;
};

export interface Comment {
  comment_id: string;
  author: string;
  comment: string;
  createdat: string;
  updatedat: string;
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
    created_at:string
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
