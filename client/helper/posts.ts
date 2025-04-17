import {  SERVER_URL } from "@/constants";
import { Post } from "@/types";

export async function getAllPosts(
  cursor?: string,
  createdAt?: string,
): Promise<{
  posts: Post[];
  totalPosts: number;
}> {
  try {
    if (cursor && !createdAt) {
      throw new Error("createdAt is required when using cursor");
    }

    const queryParams = new URLSearchParams();
    if (cursor) queryParams.append("cursor", cursor);
    if (createdAt) queryParams.append("createdAt", createdAt);

    const url = `${SERVER_URL}/posts/find-all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch posts: ${res.status} ${res.statusText} - ${errorText}`,
      );
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
}

export async function getSavedPosts(userId: string): Promise<Post[]> {
  try {
    const res = await fetch(
      `${SERVER_URL}/posts/bookmarked_post?author=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch saved posts");
    return await res.json();
  } catch (error) {
    console.info(`Error fetching saved posts: ${error}`);
    throw error;
  }
}

export async function getUserPosts(
  userId: string,
  published: boolean = true,
  cursor?: string,
  createdAt?: string,
): Promise<{
  posts: Post[];
  totalPosts: number;
}> {
  try {
    const query =
      cursor && createdAt
        ? `/posts?userId=${userId}&cursor=${cursor}&createdAt=${createdAt}&published=${published}`
        : `/posts?userId=${userId}&published=${published}`;

    const res = await fetch(`${SERVER_URL}${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user posts");
    return await res.json();
  } catch (error) {
    console.info(`Error fetching user posts: ${error}`);
    throw error;
  }
}

export async function getPostById(postId: string): Promise<Post> {
  try {
    const res = await fetch(`${SERVER_URL}/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch post by ID");
    return await res.json();
  } catch (error) {
    console.info(`Error fetching post by ID: ${error}`);
    throw error;
  }
}
