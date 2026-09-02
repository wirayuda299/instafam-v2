"use client";

import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { blurDataURL } from "@/utils/image-loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useUploadFile from "@/hooks/useUploadFile";
import { Button } from "@/components/ui/button";
import { createPost } from "@/actions/post";
import { uploadImage } from "@/actions/cloudinary";
import { CloudinaryResponse } from "@/types";

type Props = {
  onClose: () => void;
  onLoadingChange: (loading: boolean) => void;
};

const schema = z.object({
  captions: z.string().min(1, "Caption is required"),
  media: z.string().min(1, "Please add image"),
});

type SchemaType = z.infer<typeof schema>;

const fields = ["media", "captions"] as const;

export default function CreatePostFormContent({
  onClose,
  onLoadingChange,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [activeField, setActiveField] =
    useState<(typeof fields)[number]>("media");

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      captions: "",
      media: "",
    },
  });

  const { handleChange, preview, setFiles, files, setPreview } =
    useUploadFile(form);

  useEffect(() => onLoadingChange(loading), [loading, onLoadingChange]);

  const reset = () => {
    form.reset();
    setFiles(null);
    setPreview(null);
    setActiveField("media");
    onClose();
  };

  const isSubmitting = form.formState.isSubmitting;
  const isChanged = form.formState.isDirty;
  const isValid = form.formState.isValid;

  const saveToDb = async (data: SchemaType, published: boolean) => {
    if (!files || !files.media) {
      throw new Error("No file selected for upload");
    }

    const formData = new FormData();
    formData.append("files", files.media);

    let res: CloudinaryResponse | null = null;
    try {
      res = await uploadImage(formData);

      if (!res?.secure_url || !res?.public_id) {
        throw new Error("File upload failed");
      }
      const createRes = await createPost(
        {
          media: res.secure_url,
          captions: data.captions,
          media_asset_id: res.asset_id,
        },
        published,
      );

      if (createRes && "errors" in createRes) {
        throw new Error(
          typeof createRes.errors === "string"
            ? createRes.errors
            : "failed to create post",
        );
      }
    } catch (error) {
      toast.error((error as Error).message || "failed to create post");
    }
  };

  async function handlePost(data: SchemaType) {
    setLoading(true);
    try {
      await saveToDb(data, true);
      toast.success("Your post has been published");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating the post");
    } finally {
      setLoading(false);
      reset();
    }
  }

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await saveToDb(form.getValues(), false);
      toast.success("Your post saved as draft");
    } catch (e) {
      toast.error(
        (e as Error).message || "An error occurred while creating the post",
      );
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <DialogContent className="border-black-1 aspect-square max-h-[400px] w-full max-w-(--breakpoint-sm) gap-0 overflow-hidden rounded-lg bg-black p-0 text-white">
      <DialogTitle className="border-black-1 flex h-11 flex-row items-center justify-between border-b p-2">
        <button
          onClick={
            activeField === "media" ? undefined : () => setActiveField("media")
          }
          className="disabled:cursor-not-allowed disabled:opacity-50"
          aria-disabled={activeField === "media"}
          disabled={activeField === "media"}
          type="button"
          name="back"
          title="back"
        >
          <ArrowLeft />
        </button>
        <p className="font-semibold">Create new post</p>
        <button
          aria-disabled={activeField === "captions" || !preview}
          disabled={activeField === "captions" || !preview}
          onClick={
            activeField === "captions"
              ? undefined
              : () => setActiveField("captions")
          }
          title="next"
          name="next"
          className="text-sm font-semibold text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </DialogTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePost)}
          className="relative h-full min-h-[400px] min-w-full space-y-0"
        >
          {activeField === "media" &&
            (preview ? (
              <div className="group relative h-full max-h-[400px] min-w-full overflow-hidden">
                <Image
                  className="aspect-auto size-full rounded-b-lg object-cover object-center"
                  fill
                  sizes="500px"
                  placeholder={blurDataURL(500, 500)}
                  src={preview.media}
                  alt="preview"
                />
                <button
                  title="close"
                  name="close"
                  onClick={() => {
                    setFiles(null);
                    setPreview(null);
                  }}
                  type="button"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                >
                  <X className="text-red-600" />
                </button>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FormField
                  name="media"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <label
                        htmlFor="media"
                        className="hover:bg-black-1/20 mx-auto flex size-full max-w-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-600 p-8 text-center transition-colors hover:border-gray-400"
                      >
                        <Upload size={40} className="text-white/60" />
                        <span className="text-sm text-white/60">
                          Choose a photo to upload
                        </span>
                        <p
                          className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium hover:bg-blue-700"
                          role="button"
                        >
                          Select from computer
                        </p>
                      </label>
                      <input
                        accept="image/*"
                        multiple={false}
                        onChange={(e) => handleChange(e, "media")}
                        type="file"
                        name="file"
                        id="media"
                        className="hidden"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

          {activeField === "captions" && (
            <FormField
              control={form.control}
              name="captions"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="p-5">
                    <textarea
                      {...field}
                      rows={15}
                      placeholder="Add captions..."
                      className="h-full w-full bg-transparent focus-visible:outline-hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {activeField === "captions" && isValid && (
            <div className="border-black-1 fixed bottom-0 flex w-full items-center gap-2 border-t bg-black p-2">
              <Button
                aria-disabled={loading}
                onClick={handleSaveDraft}
                disabled={loading}
                type="button"
                variant="outline"
                className="hover:bg-black-1/50 flex-1 gap-2 border-gray-600 bg-transparent text-white hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && !isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Save as draft
              </Button>
              <Button
                type="submit"
                aria-disabled={loading || !isChanged || isSubmitting || !isValid}
                disabled={loading || !isChanged || isSubmitting || !isValid}
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Publish
              </Button>
            </div>
          )}
        </form>
      </Form>
    </DialogContent>
  );
}
