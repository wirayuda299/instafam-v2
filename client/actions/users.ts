"use server";
import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

import { createUserSchema, CreateUserType } from "@/validation";
import { RequestConfig, SERVER_URL } from "@/constants";

// Called only from app/api/webhooks/route.ts (Clerk's user.created webhook),
// a server-to-server call verified by svix signature, not a user session --
// eslint-disable-next-line @clerk/next/require-auth-protection -- see above
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
  await auth.protect();
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

