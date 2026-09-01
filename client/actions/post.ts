"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createPostSchema, CreatePostType } from "@/validation";
import { apiFetch } from "@/lib/http";
import { redirect } from "next/navigation";
import { deleteImage } from "@/actions/cloudinary";

export async function reportPost(postId: string, reasons: string[]) {
  await auth.protect();
  try {
    const res = await apiFetch("/posts/report", {
      method: "POST",
      credentials: "include",
      json: { postId, reasons },
    });

    if (!res.ok) throw new Error("Failed to report post");
    return await res.json();
  } catch (e) {
    return {
      errors: (e as Error).message || "Failed to report post",
    };
  }
}

export async function createPost(
  value: CreatePostType,
  published: boolean,
  pathname: string,
) {
  await auth.protect();
  try {
    const validatedValues = createPostSchema.safeParse(value);
    if (!validatedValues.success) {
      return {
        errors: "Data invalid",
      };
    }

    const { userId } = await auth.protect();
    if (!userId) throw new Error("Unauthorized");

    const { captions, media, media_asset_id } = validatedValues.data;

    const res = await apiFetch("/posts/create", {
      method: "POST",
      credentials: "include",
      json: {
        captions,
        media_url: media,
        media_asset_id,
        author: userId,
        published,
      },
    });

    if (!res.ok) throw new Error("Failed to create post");
    revalidatePath(pathname);
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}
export async function likeOrDislikePost(postId: string, pathname: string) {
  const { userId } = await auth.protect();

  try {
    if (!userId)
      return {
        errors: "Unauthorized",
      };

    const res = await apiFetch("/posts/like_or_dislike", {
      method: "POST",
      credentials: "include",
      json: {
        postId,
        liked_by: userId,
      },
    });

    if (!res.ok) throw new Error("Failed to like or dislike post");
    revalidatePath(pathname);
  } catch (error) {
    return { errors: (error as Error).message };
  }
}

export async function publishPost(postId: string, pathname: string) {
  const { userId } = await auth.protect();

  try {
    if (!userId) return { errors: "Unauthorized" };

    const res = await apiFetch("/posts/publish", {
      method: "POST",
      credentials: "include",
      json: { postId, author: userId },
    });

    if (!res.ok) throw new Error("Failed to publish post");
    revalidatePath(pathname);
  } catch (error) {
    return { errors: (error as Error).message };
  }
}

export async function updatePostCaptions(
  postId: string,
  captions: string,
  pathname: string,
) {
  const { userId } = await auth.protect();

  try {
    if (!userId) return { errors: "Unauthorized" };
    if (!captions.trim()) return { errors: "Caption is required" };

    const res = await apiFetch("/posts/update/captions", {
      method: "PUT",
      credentials: "include",
      json: { postId, author: userId, captions },
    });

    if (!res.ok) throw new Error("Failed to update caption");
    revalidatePath(pathname);
  } catch (error) {
    return { errors: (error as Error).message };
  }
}

export async function deletePost(
  fileId: string,
  postId: string,
  postAuthor: string,
  pathname: string,
) {
  const { userId } = await auth.protect();
  if (userId !== postAuthor) {
    throw new Error("UnAuthorized");
  }
  await deleteImage(fileId);

  const deletedPostRes = await apiFetch("/posts/delete", {
    method: "DELETE",
    credentials: "include",
    json: {
      postId,
      userSession: userId,
      postAuthor,
    },
  });

  if (!deletedPostRes.ok) {
    const res = await deletedPostRes.json();
    throw new Error(res.message ?? "Failed to delete post");
  }

  revalidatePath(pathname);
  if (pathname !== "/") {
    redirect("/");
  }
}

export async function saveOrDeleteBookmarkedPost(
  postId: string,
  pathname: string,
): Promise<
  | {
      errors: string;
    }
  | {
      message: string;
    }
> {
  await auth.protect();
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const res = await apiFetch("/posts/save_or_delete", {
      method: "POST",
      credentials: "include",
      json: {
        author: userId,
        postId,
      },
    });

    if (!res.ok) throw new Error("Failed to save or delete bookmarked post");
    revalidatePath(`/profile/${userId}`);
    revalidatePath(pathname);

    return { message: "Success" };
  } catch (error) {
    return { errors: (error as Error).message };
  }
}
