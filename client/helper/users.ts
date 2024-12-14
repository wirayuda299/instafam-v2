import { toast } from "sonner";

import { User } from "@/types";
import { revalidate } from "@/utils/cache";


type ShowUsers = {
  users: User[],
  totalUser: number
}
const serverUrl=process.env.SERVER_URL


export async function getUser(id: string) {
  try {
    const res = await fetch(`${serverUrl}/users/${id}`, {
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

    const res = await fetch(`${serverUrl}${query}`, {
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

export async function getUserFollowers(userId: string):Promise<{follower_id:string}[]> {
  try {
    const res = await fetch(`${serverUrl}/users/followers?userId=${userId}`, {
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

export async function getUserFollowing(userId: string):Promise<{following_id:string}[]> {
  try {
    const res = await fetch(`${serverUrl}/users/following?userId=${userId}`, {
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
    const res = await fetch(`${serverUrl}/users/search?username=${query}`, {
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
    const res = await fetch(`${serverUrl}/users/update/setting`, {
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
    const res = await fetch(`${serverUrl}/users/update/bio`, {
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

