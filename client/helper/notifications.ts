import { apiFetch } from "@/lib/http";
import { Notification } from "@/types";

export async function getNotifications(
  userId: string,
): Promise<Notification[]> {
  try {
    const res = await apiFetch(`/notifications?userId=${userId}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  } catch (error) {
    throw error;
  }
}
