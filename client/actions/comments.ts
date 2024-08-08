"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

export async function createComment(
  postId: string,
  comment: string,
  path: string,
) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    await api
      .update(
        "/comments/add",
        {
          post_id: postId,
          author: userId,
          comment,
        },
        "POST",
      )
      .then(() => {
        revalidatePath(path);
      });
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
    await api.update(
      "/comments/like_or_dislike",
      {
        commentId,
        likedBy: userId,
      },
      "POST",
    );
    revalidatePath(pathname);
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}
