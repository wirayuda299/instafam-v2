"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";

import { createPostSchema, CreatePostType } from "@/validation";
import { apiFetch } from "@/lib/http";
import { deleteImage } from "@/actions/cloudinary";

export async function reportPost(postId: string, reasons: string[]) {
  const { userId } = await auth.protect();

  if (!userId) throw new Error("unauthorized");

  try {
    const res = await apiFetch("/posts/report", {
      method: "POST",
      credentials: "include",
      json: { postId, reasons },
    });

    if (!res.ok) {
      return { errors: "failed to report post" };
    }
    return null;
  } catch (e) {
    return {
      errors: (e as Error).message || "Failed to report post",
    };
  }
}

export async function createPost(value: CreatePostType, published: boolean) {
  const { userId } = await auth.protect();

  const fallback = "failed to create post";

  if (!userId) {
    return { errors: "unauthorized" };
  }

  const validatedValues = createPostSchema.safeParse(value);
  if (!validatedValues.success) {
    return {
      errors: "Data invalid",
    };
  }

  try {
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

    if (!res.ok) {
      return { errors: fallback };
    }

    updateTag("posts");
    updateTag(`posts:${userId}`);
    return null;
  } catch (error) {
    return {
      errors: (error as Error).message ?? fallback,
    };
  }
}

export async function likeOrDislikePost(postId: string, postAuthor: string) {
  const { userId } = await auth.protect();

  if (!userId)
    return {
      errors: "Unauthorized",
    };
  const fallback = "Failed to like or dislike post";
  try {
    const res = await apiFetch("/posts/like_or_dislike", {
      method: "POST",
      credentials: "include",
      json: {
        postId,
        liked_by: userId,
      },
    });

    if (!res.ok) {
      return { errors: fallback };
    }
    updateTag("posts");
    updateTag(`posts:${postAuthor}`);
    updateTag(`post:${postId}`);
    return null;
  } catch (error) {
    return {
      errors: (error as Error).message ?? fallback,
    };
  }
}

export async function publishPost(postId: string) {
  const { userId } = await auth.protect();
  if (!userId) return { errors: "Unauthorized" };

  const fallback = "Failed to publish post";
  try {
    const res = await apiFetch("/posts/publish", {
      method: "POST",
      credentials: "include",
      json: { postId, author: userId },
    });

    if (!res.ok) {
      return { errors: fallback };
    }
    updateTag("posts");
    updateTag(`posts:${userId}`);
    updateTag(`post:${postId}`);
    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}

export async function updatePostCaptions(postId: string, captions: string) {
  const { userId } = await auth.protect();
  if (!userId) return { errors: "Unauthorized" };
  if (!captions.trim()) return { errors: "Caption is required" };

  const fallback = "Failed to update caption";
  try {
    const res = await apiFetch("/posts/update/captions", {
      method: "PUT",
      credentials: "include",
      json: { postId, author: userId, captions },
    });

    if (!res.ok) {
      return { errors: fallback };
    }
    updateTag("posts");
    updateTag(`posts:${userId}`);
    updateTag(`post:${postId}`);
    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}

export async function deletePost(
  fileId: string,
  postId: string,
  postAuthor: string,
) {
  const { userId } = await auth.protect();
  if (userId !== postAuthor) {
    return {
      errors: "Unauthorized",
    };
  }

  const fallback = "Failed to delete post";
  try {
    const imageRes = await deleteImage(fileId);
    if (imageRes && "errors" in imageRes) {
      return {
        errors: imageRes.errors,
      };
    }

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
      return {
        errors: res.message ?? fallback,
      };
    }

    updateTag("posts");
    updateTag(`posts:${postAuthor}`);
    updateTag(`post:${postId}`);
    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}

export async function saveOrDeleteBookmarkedPost(postId: string): Promise<{
  errors: string;
} | null> {
  const { userId } = await auth.protect();
  if (!userId) {
    return {
      errors: "Unauthorized",
    };
  }

  const fallback = "Failed to save or delete bookmarked post";
  try {
    const res = await apiFetch("/posts/save_or_delete", {
      method: "POST",
      credentials: "include",
      json: {
        author: userId,
        postId,
      },
    });

    if (!res.ok) {
      return { errors: fallback };
    }
    updateTag(`saved-post:${userId}`);
    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}
