"use server";

import { ApiRequest } from "@/utils/api";
import { createUserSchema, CreateUserType } from "@/validation";
import { revalidatePath } from "next/cache";

export async function createUser(values: CreateUserType) {
  try {
    const validatedValue = createUserSchema.parse(values);
    if (!validatedValue) throw new Error("Please add valid data");

    const { username, id, email, image } = validatedValue;

    await fetch("http://localhost:3001/api/v1/users/create", {
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
    }).then(async (res) => {
      return {
        message: await res.json(),
        error: false,
      };
    });
  } catch (error) {
    throw error;
  }
}





export async function followUnfollow(userId: string, userToFollow: string) {
  try {
    const api = new ApiRequest();
    await api.update(
      "/users/follow_unfollow",
      {
        userId,
        userToFollow,
      },
      "POST",
    );
    revalidatePath("/profile/" + userId);
  } catch (e) {
    return {
      errors: (e as Error).message || "Failed to follow or unfollow user",
    };
  }
}
