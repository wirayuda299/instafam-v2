import { RequestConfig, SERVER_URL } from "@/constants";
import { Comment } from "@/types";

export async function getAllComments(
  postId: string,
  cursor?: string,
  createdAt?: string,
): Promise<Comment[]> {
  try {
    const requestConf = new RequestConfig('GET')

    const query =
      cursor && createdAt
        ? `/comments/find-all?postId=${postId}&cursor=${cursor}&createdAt=${createdAt}`
        : `/comments/find-all?postId=${postId}`;

    const res = await fetch(`${SERVER_URL}${query}`, requestConf.toRequestInit());

    if (!res.ok) throw new Error('Failed to fetch comments');

    const comments = await res.json();
    return comments;
  } catch (error) {
    throw error;
  }
}
