export type Post = {
  post_id: string;
  author_id: string;
  author_name: string;
  profile_image: string;
  captions: string;
  media_url: string;
  media_asset_id: string;
  created_at: string;
  likes: PostLike[];
};

export type PostLike = {
  post_id: string;
  liked_by: string;
};





