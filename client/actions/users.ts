"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createUserSchema, CreateUserType } from "@/validation";
import { apiFetch } from "@/lib/http";

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
  await auth.protect();
  try {
    const res = await apiFetch("/users/follow_unfollow", {
      method: "POST",
      credentials: "include",
      json: {
        userId,
        userToFollow,
      },
    });

    if (!res.ok) throw new Error("Failed to follow or unfollow user");

    revalidatePath(`/profile/${userId}`);
  } catch (e) {
    return {
      errors: (e as Error).message || "Failed to follow or unfollow user",
    };
  }
}
