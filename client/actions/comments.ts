"use server";

import { updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { apiFetch } from "@/lib/http";

export async function createComment(postId: string, comment: string) {
  const { userId } = await auth.protect();
  if (!userId) return { errors: "Unauthorized" };

  const fallback = "Failed to create comment";
  try {
    const res = await apiFetch("/comments/add", {
      method: "POST",
      credentials: "include",
      json: {
        post_id: postId,
        author: userId,
        comment,
      },
    });
    if (!res.ok) return { errors: fallback };

    updateTag(`comments:${postId}`);
    return null;
  } catch (error) {
    return {
      errors: (error as Error).message ?? fallback,
    };
  }
}

export async function likeOrDislikeComment(commentId: string, postId: string) {
  const { userId } = await auth.protect();
  if (!userId) return { errors: "Unauthorized" };

  const fallback = "Failed to like or dislike comment";
  try {
    const res = await apiFetch("/comments/like_or_dislike", {
      method: "POST",
      credentials: "include",
      json: {
        commentId,
        likedBy: userId,
      },
    });

    if (!res.ok) return { errors: fallback };

    updateTag(`comments:${postId}`);
    return null;
  } catch (error) {
    return {
      errors: (error as Error).message ?? fallback,
    };
  }
}
