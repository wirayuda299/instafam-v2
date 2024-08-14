"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createPostSchema, CreatePostType } from "@/validation";
import { ApiRequest } from "@/utils/api";
import { deleteFile } from "./files";

const api = new ApiRequest();

export async function createPost(value: CreatePostType, published: boolean, pathname:string) {
  try {
    const validatedValues = createPostSchema.safeParse(value);
    if (!validatedValues.success) {
      return {
        errors: "Data invalid",
      };
    }

    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const { captions, media, media_asset_id } = validatedValues.data;

    await api
      .update(
        "/posts/create",
        {
          captions,
          media_url: media,
          media_asset_id,
          author: userId,
          published,
        },
        "POST",
      )
      .then(() => {
        revalidatePath(pathname);
      });
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}

export async function likeOrDislikePost(postId: string, pathname: string) {
  const { userId } = auth();

  try {
    if (!userId)
      return {
        errors: "Unauthorized",
      };

    await api.update(
      "/posts/like_or_dislike",
      {
        postId,
        liked_by: userId,
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

export async function deletePost(
  fileId: string,
  postId: string,
  postAuthor: string,
  pathname: string,
) {
  try {
    const { userId } = auth();
    if (userId !== postAuthor) {
      return {
        errors: "Unauthorized",
      };
    }

    const deletedFile = await deleteFile(fileId);
    if (deletedFile && "errors" in deletedFile) {
      return {
        errors: deletedFile.errors,
      };
    }

    await api
      .update(
        "/posts/delete",
        { postId, userSession: userId, postAuthor },
        "DELETE",
      )
      .then(() => {
        revalidatePath(pathname);
      });
  } catch (error) {
    return {
      errors: (error as Error).message || "Failed to delete post",
    };
  }
}

export async function saveOrDeleteBookmarkedPost(
  postId: string,
  pathname: string,
) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    await api
      .update(
        "/posts/save_or_delete",
        {
          author: userId,
          postId,
        },
        "POST",
      )
      .then(() => {
        revalidatePath(`/profile/${userId}`);
        revalidatePath(pathname);
        return {
          message: "Success",
        };
      })
      .catch((e) => {
        return {
          errors: e.message,
        };
      });
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}
