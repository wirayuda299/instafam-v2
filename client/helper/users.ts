import { toast } from "sonner";

import { User } from "@/types";
import { revalidate } from "@/utils/cache";
import { RequestConfig, SERVER_URL } from "@/constants";

type ShowUsers = {
  users: User[],
  totalUser: number
}

export async function getUser(id: string) {
  try {
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}/users/${id}`, requestConf.toRequestInit());
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
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}${query}`, requestConf.toRequestInit());

    if (!res.ok) {
      return {
        users: [],
        totalUser: 0
      };
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function getUserFollowers(userId: string): Promise<{ follower_id: string }[]> {
  try {
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}/users/followers?userId=${userId}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to fetch followers');

    const followers = await res.json();
    return followers;
  } catch (e) {
    throw e;
  }
}

export async function getUserFollowing(userId: string): Promise<{ following_id: string }[]> {
  try {
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}/users/following?userId=${userId}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to fetch following');

    const following = await res.json();
    return following;
  } catch (e) {
    throw e;
  }
}

export async function searchUser(query: string): Promise<User[] | { errors: string }> {
  try {
    const requestConf = new RequestConfig('GET')

    const res = await fetch(`${SERVER_URL}/users/search?username=${query}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to search user');

    return await res.json();
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
    const requestConf = new RequestConfig('PUT')
    requestConf.setBody(JSON.stringify({
      userId,
      userSessionId,
      show_mention,
      show_saved_post,
      show_draft_posts
    }))
    const res = await fetch(`${SERVER_URL}/users/update/setting`, requestConf.toRequestInit());

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
    const requestConf = new RequestConfig('PUT')
    requestConf.setBody(JSON.stringify({
      bio, userId
    }))
    const res = await fetch(`${SERVER_URL}/users/update/bio`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to update bio');

    revalidate(pathname);
  } catch (error) {
    throw error;
  }
}

