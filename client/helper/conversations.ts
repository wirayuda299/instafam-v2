import { apiFetch } from "@/lib/http";
import { UserConversation } from "@/types";

export async function getConversation(
  userSession: string,
): Promise<UserConversation[]> {
  try {
    const res = await apiFetch(`/conversations?userId=${userSession}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch conversation");

    const conversation = await res.json();
    return conversation;
  } catch (error) {
    throw error;
  }
}

export async function getPersonalMessage(userId: string) {
  try {
    const res = await apiFetch(`/conversations/messages?userId=${userId}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch personal messages");

    const messages = await res.json();
    return messages;
  } catch (e) {
    throw e;
  }
}
