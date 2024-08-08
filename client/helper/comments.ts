import { Comment } from "@/types";
import { ApiRequest } from "@/utils/api";

const api = new ApiRequest();

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
    return await api.getData(query);
  } catch (error) {
    throw error;
  }
}
