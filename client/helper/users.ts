import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

type User = {
  id: string;
  username: string;
  email: string;
  profile_image: string;
};

export async function getUser(id: string) {
  try {
    return await api.getData<User>(`/users/${id}`);
  } catch (error) {
    throw error;
  }
}
export async function showUsers(userId: string, limit: number = 8) {
  try {
    if (!userId) return [];

    return await api.getData<User[]>(`/users?userId=${userId}&limit=${limit}`);
  } catch (error) {
    throw error;
  }
}

export async function getUserFollowers(userId: string) {
  try {
    return await api.getData<{ follower_id: string }[]>(
      `/users/followers?userId=${userId}`,
    );
  } catch (e) {
    throw e;
  }
}
export async function getUserFollowing(userId: string) {
  try {
    const following = await api.getData<{ following_id: string }[]>(
      `/users/following?userId=${userId}`,
    );
    return following;
  } catch (e) {
    throw e;
  }
}

export async function searchUser(
  query: string,
): Promise<User[] | { errors: string }> {
  try {
    return await api.getData<User[]>(`/users/search?username=${query}`);
  } catch (e) {
    return {
      errors: (e as Error).message,
    };
  }
}
