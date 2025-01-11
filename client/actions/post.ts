"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createPostSchema, CreatePostType } from "@/validation";
import { RequestConfig, SERVER_URL } from "@/constants";
import { redirect } from "next/navigation";


async function deleteImage(id: string) {
    try {

        const requestConf = new RequestConfig('DELETE')
        requestConf.setBody(JSON.stringify({ id }))

        const deletedImageRes = await fetch(SERVER_URL + '/image/delete', requestConf.toRequestInit())

        if (!deletedImageRes.ok) {
            const res = await deletedImageRes.json()
            throw new Error(res.message ?? "Failed to delete image")
        }
        return 'ok'

    } catch (error) {
        throw error
    }

}

export async function reportPost(postId: string, reasons: string[]) {
    try {
        const requestConf = new RequestConfig('POST')
        requestConf.setBody(JSON.stringify({ postId, reasons }))

        const res = await fetch(`${SERVER_URL}/posts/report`, requestConf.toRequestInit());

        if (!res.ok) throw new Error('Failed to report post');
        return await res.json();
    } catch (e) {
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
        const requestConf = new RequestConfig('POST')
        requestConf.setBody(JSON.stringify({
            captions,
            media_url: media,
            media_asset_id,
            author: userId,
            published,
        }))

        const res = await fetch(`${SERVER_URL}/posts/create`, requestConf.toRequestInit());

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

        const requestConf = new RequestConfig('POST')
        requestConf.setBody(JSON.stringify({
            postId,
            liked_by: userId,
        }))
        const res = await fetch(`${SERVER_URL}/posts/like_or_dislike`, requestConf.toRequestInit());

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
    const { userId } = auth();
    if (userId !== postAuthor) {
        throw new Error('UnAuthorized')
    }
    const deleteImageRes = await deleteImage(fileId)

    if (deleteImageRes !== 'ok') {
        throw new Error('Failed to delete image')
    }

    const requestConf = new RequestConfig('DELETE')
    requestConf.setBody(JSON.stringify({
        postId, userSession: userId, postAuthor
    }))
    const deletedPostRes = await fetch(`${SERVER_URL}/posts/delete`, requestConf.toRequestInit())

    if (!deletedPostRes.ok) {
        const res = await deletedPostRes.json()
        throw new Error(res.message ?? "Failed to delete post")
    }

    revalidatePath(pathname);
    if (pathname !== '/') {
        redirect('/')
    }
}

export async function saveOrDeleteBookmarkedPost(postId: string, pathname: string): Promise<{
    errors: string
} | {
    message: string
}> {
    try {
        const { userId } = auth();
        if (!userId) throw new Error("Unauthorized");

        const requestConf = new RequestConfig('POST')
        requestConf.setBody(JSON.stringify({
            author: userId,
            postId,
        }))
        const res = await fetch(`${SERVER_URL}/posts/save_or_delete`, requestConf.toRequestInit());

        if (!res.ok) throw new Error('Failed to save or delete bookmarked post');
        revalidatePath(`/profile/${userId}`);
        revalidatePath(pathname);

        return { message: "Success" };
    } catch (error) {
        return { errors: (error as Error).message };
    }
}

