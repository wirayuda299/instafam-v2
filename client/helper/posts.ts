import { RequestConfig, SERVER_URL } from "@/constants";
import { Post } from "@/types";

export async function getAllPosts(cursor?: string, createdAt?: string): Promise<{
  posts: Post[],
  totalPosts: number
}> {
  try {
    const query =
      cursor && createdAt
        ? `/posts/find-all?cursor=${cursor}&createdAt=${createdAt}`
        : "/posts/find-all";
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}${query}`, requestConf.toRequestInit());

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSavedPosts(userId: string): Promise<Post[]> {
  try {
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}/posts/bookmarked_post?author=${userId}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to fetch saved posts');

    const posts = await res.json();
    return posts;
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

    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}${query}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to fetch user posts');

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPostById(postId: string) {
  try {
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}/posts/${postId}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to fetch post by ID');

    const post = await res.json();
    return post;
  } catch (error) {
    throw error;
  }
}

