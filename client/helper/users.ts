import { toast } from "sonner";

import { User } from "@/types";
import { ApiRequest } from "@/utils/api";
import { revalidate } from "@/utils/cache";

const api = new ApiRequest();

type ShowUsers = {
  users: User[],
  totalUser: number
}

export async function getUser(id: string) {
  try {
    return await api.getData<User>(`/users/${id}`);
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
      }
    }
    const query = lastCursor ? `/users?userId=${userId}&lastCursor=${lastCursor}` : `/users?userId=${userId}`

    return await api.getData<ShowUsers>(query);
  } catch (error) {
    throw error;
  }

}

export async function getUserFollowers(userId: string) {
  try {
    return await api.getData<{ follower_id: string }[]>(`/users/followers?userId=${userId}`);
  } catch (e) {
    throw e;
  }
}

export async function getUserFollowing(userId: string) {
  try {
    const following = await api.getData<{ following_id: string }[]>(`/users/following?userId=${userId}`);
    return following;
  } catch (e) {
    throw e;
  }
}

export async function searchUser(query: string): Promise<User[] | { errors: string }> {
  try {
    return await api.getData<User[]>(`/users/search?username=${query}`);
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

    await api
      .update(
        "/users/update/setting",
        {
          userId,
          userSessionId,
          show_mention,
          show_saved_post,
          show_draft_posts,
        },
        "PUT",
      )
      .then(() => {
        revalidate(pathname);
        toast.success("User setting has been updated");
      });
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
    await api.update("/users/update/bio", { bio, userId }, "PUT");
    revalidate(pathname);
  } catch (error) {
    throw error;
  }
}
