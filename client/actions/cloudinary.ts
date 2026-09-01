"use server";
import { auth } from "@clerk/nextjs/server";

import { apiFetch } from "@/lib/http";
import { CloudinaryResponse } from "@/types";

export async function uploadImage(
  formData: FormData,
): Promise<CloudinaryResponse> {
  await auth.protect();
  try {
    const uploadResponse = await apiFetch("/image/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const res = await uploadResponse.json();
      console.log(res);
      throw new Error(res.message || "Upload failed");
    }

    return await uploadResponse.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteImage(id: string) {
  await auth.protect();
  try {
    const deleteRes = await apiFetch("/image/delete", {
      method: "DELETE",
      credentials: "include",
      json: { id },
    });

    if (!deleteRes.ok) {
      const errorData = await deleteRes.json();
      throw new Error(errorData.message || "Delete failed");
    }

    return "success";
  } catch (error) {
    throw error;
  }
}
