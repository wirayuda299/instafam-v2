"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { RequestConfig, SERVER_URL } from "@/constants";

export async function createComment(
  postId: string,
  comment: string,
  path: string,
) {
  await auth.protect();
  try {

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const requestConf = new RequestConfig('POST')
    requestConf.setBody(JSON.stringify({
      post_id: postId,
      author: userId,
      comment
    }))


    const res = await fetch(`${SERVER_URL}/comments/add`, requestConf.toRequestInit());
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
  const { userId } = await auth.protect();

  try {
    if (!userId)
      return {
        errors: "Unauthorized",
      };


    const requestConf = new RequestConfig('POST')
    requestConf.setBody(JSON.stringify({
      commentId,
      likedBy: userId
    }))

    const res = await fetch(`${SERVER_URL}/comments/like_or_dislike`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to like or dislike comment');

    revalidatePath(pathname);
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}

