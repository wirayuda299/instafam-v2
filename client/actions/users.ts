"use server";

import { revalidatePath } from "next/cache";

import { createUserSchema, CreateUserType } from "@/validation";
import { RequestConfig, SERVER_URL } from "@/constants";

export async function createUser(values: CreateUserType) {
  try {
    const validatedValue = createUserSchema.parse(values);
    if (!validatedValue) throw new Error("Please add valid data");

    const { username, id, email, image } = validatedValue;

    const requestConf = new RequestConfig('POST')
    requestConf.setBody(JSON.stringify({
      username,
      id,
      email,
      image,
    }))
    const res = await fetch(`${SERVER_URL}/users/create`, requestConf.toRequestInit());

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
    const requestConf = new RequestConfig('POST')
    requestConf.setBody(JSON.stringify({
      userId,
      userToFollow,
    }))
    const res = await fetch(`${SERVER_URL}/users/follow_unfollow`, requestConf.toRequestInit());

    if (!res.ok) throw new Error("Failed to follow or unfollow user");

    revalidatePath(`/profile/${userId}`);
  } catch (e) {
    return {
      errors: (e as Error).message || "Failed to follow or unfollow user",
    };
  }
}

