"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createPostSchema, CreatePostType } from "@/validation";

const serverUrl=process.env.SERVER_URL+'/api/v1'


export async function reportPost(postId: string, reasons: string[]) {
    try {
        const res = await fetch(`${serverUrl}/posts/report`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ postId, reasons })
        });

        if (!res.ok) throw new Error('Failed to report post');
        return await res.json();
    } catch (e) {
    console.log(e)
        return {
            errors: (e as Error).message || "Failed to report post"
        };
    }
}


export async function createPost(value: CreatePostType, published: boolean, pathname: string) {
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

        const res = await fetch(`${serverUrl}/posts/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                captions,
                media_url: media,
                media_asset_id,
                author: userId,
                published,
            })
        });

        if (!res.ok) throw new Error('Failed to create post');
        revalidatePath(pathname);
    } catch (error) {
        return {
            errors: (error as Error).message,
        };
    }
}
export async function likeOrDislikePost(postId: string, pathname: string) {
    const { userId } = auth();

    try {
        if (!userId) return {
            errors: "Unauthorized",
        };
        const res = await fetch(`${serverUrl}/posts/like_or_dislike`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                postId,
                liked_by: userId,
            })
        });

        if (!res.ok) throw new Error('Failed to like or dislike post');
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
    try {
        const { userId } = auth();
        if (userId !== postAuthor) {
            return {
                errors: "Unauthorized",
            };
        }

        //const deletedFile = await deleteFile(fileId);
        //if (deletedFile && "errors" in deletedFile) {
        //    return {
        //        errors: deletedFile.errors,
        //    };
        //}

        const res = await fetch(`${serverUrl}/posts/delete`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ postId, userSession: userId, postAuthor })
        });

        if (!res.ok) throw new Error('Failed to delete post');
        revalidatePath(pathname);
    } catch (error) {
        return {
            errors: (error as Error).message || "Failed to delete post",
        };
    }
}

export async function saveOrDeleteBookmarkedPost(postId: string, pathname: string):Promise<{
  errors:string
}|{
  message:string
}> {
    try {
        const { userId } = auth();
        if (!userId) throw new Error("Unauthorized");

        const res = await fetch(`${serverUrl}/posts/save_or_delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                author: userId,
                postId,
            })
        });

    console.log(res)
        if (!res.ok) throw new Error('Failed to save or delete bookmarked post');
        revalidatePath(`/profile/${userId}`);
        revalidatePath(pathname);
        return { message: "Success" };
    } catch (error) {
        return { errors: (error as Error).message };
    }
}

