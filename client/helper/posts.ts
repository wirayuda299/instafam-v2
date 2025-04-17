import { RequestConfig, SERVER_URL } from "@/constants";
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

    const requestConf = new RequestConfig("GET");

    const res = await fetch(url, requestConf.toRequestInit());

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
  const requestConf = new RequestConfig("GET");
  const res = await fetch(
    `${SERVER_URL}/posts/bookmarked_post?author=${userId}`,
    requestConf.toRequestInit(),
  );

  if (!res.ok) throw new Error("Failed to fetch saved posts");
  return await res.json();
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
  const query =
    cursor && createdAt
      ? `/posts?userId=${userId}&cursor=${cursor}&createdAt=${createdAt}&published=${published}`
      : `/posts?userId=${userId}&published=${published}`;

  const requestConf = new RequestConfig("GET");
  const res = await fetch(`${SERVER_URL}${query}`, requestConf.toRequestInit());

  if (!res.ok) throw new Error("Failed to fetch user posts");
  return await res.json();
}

export async function getPostById(postId: string): Promise<Post> {
  const requestConf = new RequestConfig("GET");
  const res = await fetch(
    `${SERVER_URL}/posts/${postId}`,
    requestConf.toRequestInit(),
  );

  if (!res.ok) throw new Error("Failed to fetch post by ID");
  return await res.json();
}
