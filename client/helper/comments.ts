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

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('Failed to fetch comments');

    const comments = await res.json();
    return comments;
  } catch (error) {
    throw error;
  }
}
