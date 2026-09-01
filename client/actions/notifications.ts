"use server";

import { auth } from "@clerk/nextjs/server";

import { apiFetch } from "@/lib/http";

export async function markNotificationsRead(userId: string) {
  await auth.protect();
  try {
    const res = await apiFetch("/notifications/mark-read", {
      method: "PUT",
      credentials: "include",
      json: { userId },
    });

    if (!res.ok) throw new Error("Failed to mark notifications as read");
  } catch (error) {
    return { errors: (error as Error).message };
  }
}
