import {
  encodeImageToBlurhash,
  getImageData,
  loadImage,
} from "@/utils/image-loader";
import { ChangeEvent, useCallback, useState } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";

export default function useUploadFile<T extends FieldValues>(
  form: UseFormReturn<T>,
) {
  const [files, setFiles] = useState<Record<string, File> | null>(null);
  const [preview, setPreview] = useState<Record<string, string> | null>(null);

  const handleFileChange = useCallback(
    (field: Path<T>, file: File) => {
      if (file) {
        setFiles((prev) => ({
          ...prev!,
          [field]: file,
        }));

        form.setValue(field, file as PathValue<T, Path<T>>, {
          shouldDirty: true,
        });
      }
    },
    [form],
  );

  const handlePreviewChange = useCallback(
    async (field: Path<T>, result: string | ArrayBuffer | null, file: File) => {
      setPreview((prev) => ({
        ...prev!,
        [field]: result as string,
      }));
      form.setValue(field, result as PathValue<T, Path<T>>, {
        shouldDirty: true,
      });
    },
    [form],
  );

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, field: Path<T>) => {
      if (!e.target.files) return;

      const file = e.target.files[0];

      try {
        if (field !== "audio") {
          handleFileChange(field, file);

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              handlePreviewChange(field, event.target?.result, file);
            }
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [handleFileChange, handlePreviewChange],
  );

  return {
    files,
    setFiles,
    preview,
    setPreview,
    handleChange,
    handleFileChange,
  };
}
