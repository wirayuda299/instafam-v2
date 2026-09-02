"use server";

import { auth } from "@clerk/nextjs/server";

import { apiFetch } from "@/lib/http";

export async function markNotificationsRead(userId: string) {
  const { userId: sessionUserId } = await auth.protect();
  if (sessionUserId !== userId) return { errors: "Unauthorized" };

  const fallback = "Failed to mark notifications as read";
  try {
    const res = await apiFetch("/notifications/mark-read", {
      method: "PUT",
      credentials: "include",
      json: { userId },
    });

    if (!res.ok) return { errors: fallback };
    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}
