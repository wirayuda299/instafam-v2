"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { SERVER_URL } from "@/constants";

export async function createComment(
  postId: string,
  comment: string,
  path: string,
) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const res = await fetch(`${SERVER_URL}/comments/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        post_id: postId,
        author: userId,
        comment
      })
    });

    if (!res.ok) throw new Error('Failed to create comment');

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
  const { userId } = auth();

  try {
    if (!userId)
      return {
        errors: "Unauthorized",
      };

    const res = await fetch(`${SERVER_URL}/comments/like_or_dislike`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        commentId,
        likedBy: userId
      })
    });

    if (!res.ok) throw new Error('Failed to like or dislike comment');

    revalidatePath(pathname);
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}

