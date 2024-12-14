"use server";

import { revalidatePath } from "next/cache";

import { createUserSchema, CreateUserType } from "@/validation";
const serverUrl=process.env.SERVER_URL


export async function createUser(values: CreateUserType) {
  try {
    const validatedValue = createUserSchema.parse(values);
    if (!validatedValue) throw new Error("Please add valid data");

    const { username, id, email, image } = validatedValue;

    const res = await fetch(`${serverUrl}/api/v1/users/create`, {
      body: JSON.stringify({
        username,
        id,
        email,
        image,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to create user");

    return {
      message: await res.json(),
      error: false,
    };
  } catch (error) {
    throw error;
  }
}

export async function followUnfollow(userId: string, userToFollow: string) {
  try {
    const res = await fetch(`${serverUrl}/users/follow_unfollow`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userToFollow,
      }),
    });

    if (!res.ok) throw new Error("Failed to follow or unfollow user");

    revalidatePath(`/profile/${userId}`);
  } catch (e) {
    return {
      errors: (e as Error).message || "Failed to follow or unfollow user",
    };
  }
}

