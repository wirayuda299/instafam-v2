import { Post } from "@/types";
import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

export async function getAllPosts(cursor?: string, createdAt?: string) {
  try {
    const query =
      cursor && createdAt
        ? `/posts/find-all?cursor=${cursor}&createdAt=${createdAt}`
        : "/posts/find-all";

    return await api.getData<{
      posts: Post[];
      totalPosts: number;
    }>(query);
  } catch (error) {
    throw error;
  }
}

export async function getSavedPosts(userId: string): Promise<Post[]> {
  try {
    const query = `/posts/bookmarked_post?author=${userId}`;

    return await api.getData(query);
  } catch (error) {
    throw error;
  }
}

export async function getUserPosts(
  userId: string,
  published: boolean = true,
  cursor?: string,
  createdAt?: string,
) {
  try {
    const query =
      cursor && createdAt
        ? `/posts?userId=${userId}&cursor=${cursor}&createdAt=${createdAt}&published=${published}`
        : `/posts?userId=${userId}&published=${published}`;

    return await api.getData<{
      posts: Post[];
      totalPosts: number;
    }>(query);
  } catch (error) {
    throw error;
  }
}

export async function getPostById(postId: string) {
  try {
    return await api.getData<Post>(`/posts/${postId}`);
  } catch (error) {
    throw error;
  }
}
