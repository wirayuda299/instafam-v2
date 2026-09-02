import { apiFetch } from "@/lib/http";
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

    const query = `/posts/find-all${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const res = await apiFetch(query, {
      method: "GET",
      next: { revalidate: 30, tags: ["posts"] },
    });

    if (!res.ok) {
      const err = await res.json();
      console.log(err);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
}

export async function getSavedPosts(userId: string): Promise<Post[]> {
  try {
    const res = await apiFetch(`/posts/bookmarked_post?author=${userId}`, {
      method: "GET",
    });

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

    const res = await apiFetch(query, { method: "GET" });

    if (!res.ok) throw new Error("Failed to fetch user posts");
    return await res.json();
  } catch (error) {
    console.info(`Error fetching user posts: ${error}`);
    throw error;
  }
}

export async function getPostById(
  postId: string,
  viewerId?: string,
): Promise<Post | null> {
  try {
    const query = viewerId
      ? `/posts/${postId}?userId=${viewerId}`
      : `/posts/${postId}`;
    const res = await apiFetch(query, { method: "GET" });

    if (!res.ok) throw new Error("Failed to fetch post by ID");
    return await res.json();
  } catch (error) {
    console.info(`Error fetching post by ID: ${error}`);
    throw error;
  }
}
