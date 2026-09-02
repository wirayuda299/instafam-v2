"use server";
import { auth } from "@clerk/nextjs/server";

import { apiFetch } from "@/lib/http";
import { CloudinaryResponse } from "@/types";

export async function uploadImage(
  formData: FormData,
): Promise<CloudinaryResponse> {
  const { userId } = await auth.protect();
  if (!userId) throw new Error("unauthorized");

  const uploadResponse = await apiFetch("/image/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!uploadResponse.ok) {
    const res = await uploadResponse.json();
    throw new Error(res.message || "Upload failed");
  }

  return await uploadResponse.json();
}

export async function deleteImage(id: string) {
  const { userId } = await auth.protect();

  if (!userId)
    return {
      errors: "unauthorized",
    };

  const fallback = "failed to delete image";
  try {
    const deleteRes = await apiFetch("/image/delete", {
      method: "DELETE",
      credentials: "include",
      json: { id },
    });

    if (!deleteRes.ok) {
      const errorData = await deleteRes.json();
      return {
        errors: errorData.message ?? fallback,
      };
    }

    return null;
  } catch (error) {
    return { errors: (error as Error).message ?? fallback };
  }
}
