"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";

import { createUserSchema, CreateUserType } from "@/validation";
import { apiFetch } from "@/lib/http";

// eslint-disable-next-line @clerk/next/require-auth-protection
export async function createUser(values: CreateUserType) {
  try {
    const validatedValue = createUserSchema.parse(values);
    if (!validatedValue) throw new Error("Please add valid data");

    const { username, id, email, image } = validatedValue;

    const res = await apiFetch("/users/create", {
      method: "POST",
      credentials: "include",
      json: {
        username,
        id,
        email,
        image,
      },
    });

    if (!res.ok) throw new Error("Failed to create user");

    return {
      message: await res.json(),
      error: false,
    };
  } catch (error) {
    console.log("failed to create user -> ", error);
    throw error;
  }
}

export async function followUnfollow(userId: string, userToFollow: string) {
  const { userId: sessionUserId } = await auth.protect();
  if (sessionUserId !== userId) return { errors: "Unauthorized" };

  const fallback = "Failed to follow or unfollow user";
  try {
    const res = await apiFetch("/users/follow_unfollow", {
      method: "POST",
      credentials: "include",
      json: {
        userId,
        userToFollow,
      },
    });

    if (!res.ok) return { errors: fallback };

    updateTag(`following:${userId}`);
    updateTag(`followers:${userToFollow}`);
    return null;
  } catch (e) {
    return {
      errors: (e as Error).message || fallback,
    };
  }
}

export async function updateUserSetting(
  userId: string,
  show_mention: boolean,
  show_saved_post: boolean,
  show_draft_posts: boolean,
) {
  const { userId: sessionUserId } = await auth.protect();
  if (sessionUserId !== userId) return { errors: "Unauthorized" };

  const fallback = "Failed to update settings";
  try {
    const res = await apiFetch("/users/update/setting", {
      method: "PUT",
      credentials: "include",
      json: {
        userId,
        userSessionId: sessionUserId,
        show_mention,
        show_saved_post,
        show_draft_posts,
      },
    });

    if (!res.ok) return { errors: fallback };

    updateTag(`user:${userId}`);
    return null;
  } catch (e) {
    return { errors: (e as Error).message ?? fallback };
  }
}

export async function updateUserBio(bio: string, userId: string) {
  const { userId: sessionUserId } = await auth.protect();
  if (sessionUserId !== userId) return { errors: "Unauthorized" };

  const fallback = "Failed to update bio";
  try {
    const res = await apiFetch("/users/update/bio", {
      method: "PUT",
      credentials: "include",
      json: { bio, userId },
    });

    if (!res.ok) return { errors: fallback };

    updateTag(`user:${userId}`);
    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}
