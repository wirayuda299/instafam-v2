import { Post, User } from "@/types";
import { revalidate } from "@/utils/cache";
import { toast } from "sonner";

type ShowUsers = {
  users: User[],
  totalUser: number
}

export async function getUser(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) return;

    const user = await res.json();
    return user;
  } catch (error) {
    throw error;
  }
}

export async function showUsers(userId: string, lastCursor?: string): Promise<ShowUsers> {
  try {
    if (!userId) {
      return {
        users: [] as User[],
        totalUser: 0
      };
    }

    const query = lastCursor ? `/users?userId=${userId}&lastCursor=${lastCursor}` : `/users?userId=${userId}`;

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) {
      return {
        users: [],
        totalUser: 0
      };
    }

    const users = await res.json();
    return users;
  } catch (error) {
    throw error;
  }
}

export async function getUserFollowers(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/followers?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch followers');

    const followers = await res.json();
    return followers;
  } catch (e) {
    throw e;
  }
}

export async function getUserFollowing(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/following?userId=${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch following');

    const following = await res.json();
    return following;
  } catch (e) {
    throw e;
  }
}

export async function searchUser(query: string): Promise<User[] | { errors: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/search?username=${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to search user');

    const users = await res.json();
    return users;
  } catch (e) {
    return {
      errors: (e as Error).message
    };
  }
}

export async function updateUserSetting(
  userId: string,
  userSessionId: string,
  show_mention: boolean,
  show_saved_post: boolean,
  show_draft_posts: boolean,
  pathname: string,
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/update/setting`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        userSessionId,
        show_mention,
        show_saved_post,
        show_draft_posts
      })
    });

    if (!res.ok) throw new Error('Failed to update settings');

    revalidate(pathname);
    toast.success("User setting has been updated");
  } catch (e) {
    toast.error((e as Error).message || "Failed to update");
  }
}

export async function updateUserBio(
  bio: string,
  userId: string,
  pathname: string,
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/update/bio`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
  body: JSON.stringify({ bio, userId })
    });

    if (!res.ok) throw new Error('Failed to update bio');

    revalidate(pathname);
  } catch (error) {
    throw error;
  }
}

export async function getAllPosts(cursor?: string, createdAt?: string):Promise<{
  posts:Post[],
  totalPosts:number
}> {
  try {
    const query =
      cursor && createdAt
        ? `/posts/find-all?cursor=${cursor}&createdAt=${createdAt}`
        : "/posts/find-all";

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch posts');

    const data = await res.json();
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

