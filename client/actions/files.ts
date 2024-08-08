"use server";

import type { FileEsque, UploadFileResult } from "uploadthing/types";

import { utapi } from "@/lib/uploadthing";

type UploadFilesResponse =
  | UploadFileResult
  | {
      data: null;
      error: string;
    }
  | {
      errors: string;
    };

export async function uploadFiles(
  formData: FormData,
): Promise<UploadFilesResponse> {
  try {
    const files = formData.getAll("files");
    if (!files) {
      return { errors: "No files attached" };
    }

    const response = await utapi.uploadFiles(files as FileEsque[]);

    return response[0] as UploadFileResult;
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}

export async function deleteFile(id: string) {
  try {
    if (!id)
      return {
        errors: "Image id is required",
      };
    await utapi.deleteFiles(id).then(() => {
      return {
        message: "Image deleted",
        error: false,
      };
    });
  } catch (error) {
    return {
      errors: (error as Error).message,
    };
  }
}
