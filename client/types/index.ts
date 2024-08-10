
export type Post = {
  post_id: string;
  author_id: string;
  author_name: string;
  profile_image: string;
  captions: string;
  media_url: string;
  media_asset_id: string;
  createdat: string;
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
  profile_image: string;
  bio:  string
   settings: {
    userid: string,
    show_saved_post :boolean
    show_mention: boolean,
    show_draft_posts: boolean
  }
};
export type ConversationMessage = {
  conversation_id: string;
  message: string;
  is_read: boolean;
  author: string;
  message_id: string;
  profile_image: string;
  media_image: string;
  media_image_asset_id: string;
  created_at: string;
  update_at: string;
  username: string;
}
