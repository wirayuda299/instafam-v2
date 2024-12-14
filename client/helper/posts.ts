import { Post  } from "@/types";

const serverUrl=process.env.SERVER_URL

export async function getAllPosts(cursor?: string, createdAt?: string):Promise<{
  posts:Post[],
  totalPosts:number
}> {
  try {
    const query =
      cursor && createdAt
        ? `/api/v1/posts/find-all?cursor=${cursor}&createdAt=${createdAt}`
        : "/api/v1/posts/find-all";

    const res = await fetch(`${serverUrl}${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    const data = await res.json();
    console.log(data)
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSavedPosts(userId: string): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/bookmarked_post?author=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

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

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch user posts');

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPostById(postId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch post by ID');

    const post = await res.json();
    return post;
  } catch (error) {
    throw error;
  }
}

