import { toast } from "sonner";

import { User } from "@/types";
import { revalidate } from "@/utils/cache";
import { apiFetch } from "@/lib/http";

type ShowUsers = {
  users: User[];
  totalUser: number;
};

export async function getUser(id: string) {
  try {
    const res = await apiFetch(`/users/${id}`, {
      credentials: "include",
    });
    if (!res.ok) return;

    const user = await res.json();
    return user;
  } catch (error) {
    throw error;
  }
}

export async function showUsers(
  userId: string,
  lastCursor?: string,
): Promise<ShowUsers> {
  try {
    const query = lastCursor
      ? `/users?userId=${userId}&lastCursor=${lastCursor}`
      : `/users?userId=${userId}`;

    const res = await apiFetch(query, {
      credentials: "include",
    });

    if (!res.ok) {
      const fetchRes = await res.json();
      throw new Error(fetchRes.message || "Failed to fetch user");
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
}

export async function getUserFollowers(
  userId: string,
): Promise<{ follower_id: string }[]> {
  try {
    const res = await apiFetch(`/users/followers?userId=${userId}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch followers");

    const followers = await res.json();
    return followers;
  } catch (e) {
    throw e;
  }
}

export async function getUserFollowing(
  userId: string,
): Promise<{ following_id: string }[]> {
  try {
    const res = await apiFetch(`/users/following?userId=${userId}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch following");

    const following = await res.json();
    return following;
  } catch (e) {
    throw e;
  }
}

export async function getFollowStatus(
  userId: string,
  targetId: string,
): Promise<{ is_following: boolean; is_follower: boolean }> {
  try {
    const res = await apiFetch(
      `/users/follow_status?userId=${userId}&targetId=${targetId}`,
      { credentials: "include" },
    );

    if (!res.ok) throw new Error("Failed to fetch follow status");

    return await res.json();
  } catch (e) {
    throw e;
  }
}

export async function searchUser(
  query: string,
): Promise<User[] | { errors: string }> {
  try {
    const res = await apiFetch(`/users/search?username=${query}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to search user");

    return await res.json();
  } catch (e) {
    return {
      errors: (e as Error).message,
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
    const res = await apiFetch("/users/update/setting", {
      method: "PUT",
      credentials: "include",
      json: {
        userId,
        userSessionId,
        show_mention,
        show_saved_post,
        show_draft_posts,
      },
    });

    if (!res.ok) throw new Error("Failed to update settings");

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
    const res = await apiFetch("/users/update/bio", {
      method: "PUT",
      credentials: "include",
      json: {
        bio,
        userId,
      },
    });

    if (!res.ok) throw new Error("Failed to update bio");

    revalidate(pathname);
  } catch (error) {
    throw error;
  }
}
