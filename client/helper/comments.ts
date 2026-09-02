import { apiFetch } from "@/lib/http";
import { Comment } from "@/types";

export async function getAllComments(
  postId: string,
  cursor?: string,
  createdAt?: string,
): Promise<Comment[]> {
  try {
    const query =
      cursor && createdAt
        ? `/comments/find-all?postId=${postId}&cursor=${cursor}&createdAt=${createdAt}`
        : `/comments/find-all?postId=${postId}`;

    const res = await apiFetch(query, {
      credentials: "include",
      next: { tags: [`comments:${postId}`] },
    });

    if (!res.ok) throw new Error("Failed to fetch comments");

    const comments = await res.json();
    return comments;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
