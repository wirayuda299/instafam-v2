"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { apiFetch } from "@/lib/http";

export async function createComment(
  postId: string,
  comment: string,
  path: string,
) {
  await auth.protect();
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const res = await apiFetch("/comments/add", {
      method: "POST",
      credentials: "include",
      json: {
        post_id: postId,
        author: userId,
        comment,
      },
    });
    if (!res.ok) throw new Error("Failed to create comment");

    revalidatePath(path);
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}

export async function likeOrDislikeComment(
  commentId: string,
  pathname: string,
) {
  const { userId } = await auth.protect();

  try {
    if (!userId)
      return {
        errors: "Unauthorized",
      };

    const res = await apiFetch("/comments/like_or_dislike", {
      method: "POST",
      credentials: "include",
      json: {
        commentId,
        likedBy: userId,
      },
    });

    if (!res.ok) throw new Error("Failed to like or dislike comment");

    revalidatePath(pathname);
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}
