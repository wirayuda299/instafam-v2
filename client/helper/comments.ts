import { Comment } from "@/types";
const serverUrl=process.env.SERVER_URL


export async function getAllComments(
  postId: string,
  cursor?: string,
  createdAt?: string,
): Promise<Comment[]> {
  try {
    const query =
      cursor && createdAt
        ? `/api/v1/comments/find-all?postId=${postId}&cursor=${cursor}&createdAt=${createdAt}`
        : `/api/v1/comments/find-all?postId=${postId}`;

    const res = await fetch(`${serverUrl}${query}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'content-type': 'application/json'
      }
    });

    console.log(res)
    if (!res.ok) throw new Error('Failed to fetch comments');

    const comments = await res.json();
    return comments;
  } catch (error) {
    throw error;
  }
}
