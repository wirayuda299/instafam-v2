"use client";

import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toBase64, shimmer } from "@/utils/image-loader";
import { cn } from "@/lib/utils";
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
import { handleError } from "@/utils/error";

type Props = {
  Icon: JSX.Element;
  label: string;
  isCurrentPathMessages: boolean;
};

const schema = z.object({
  captions: z.string().min(1, "Caption is required"),
  media: z.string().min(1, "Please add image"),
});

type SchemaType = z.infer<typeof schema>;

const fields = ["media", "captions"] as const;

export default function CreatePostForm({
  Icon,
  isCurrentPathMessages,
  label,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState(false)

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

  const reset = () => {
    form.reset();
    setFiles(null);
    setPreview(null);
    setIsOpen(false);
    setActiveField("media");
  };

  const isSubmitting = form.formState.isSubmitting;
  const isChanged = form.formState.isDirty;
  const isValid = form.formState.isValid

  async function handlePost(data: SchemaType) {
    if (!files) {
      toast.error("No files selected");
      return;
    }

    let uploadedFiles: any;


    try {
      setIsDraft(false)
      const formData = new FormData();
      formData.append("files", files.media);

      const { uploadFiles } = await import('@/actions/files')
      uploadedFiles = await uploadFiles(formData);

      if ("errors" in uploadedFiles) {
        toast.error(uploadedFiles.errors);
      }

      if (
        uploadedFiles &&
        "data" in uploadedFiles &&
        uploadedFiles.data !== null
      ) {
        const res = await createPost({
          captions: data.captions,
          media: uploadedFiles.data.url,
          media_asset_id: uploadedFiles.data.key,
        }, isDraft);

        if (res && "errors" in res) {
          handleError(res, "Something went wrong");
          const { deleteFile } = await import('@/actions/files')
          const deletedFile = await deleteFile(uploadedFiles.data.key);

          if (deletedFile && "errors" in deletedFile) {
            handleError(deletedFile, "Failed to delete a file");
          }
        } else {
          toast.success("Post has been published");
          reset();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating the post");
    }
  }

  return (
    <Dialog
      open={isOpen}
      modal={false}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset();
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <li className="group rounded-md p-2 hover:bg-black-1/30 md:w-full">
          <button type="button" className="flex items-center gap-3">
            {Icon}
            <span
              data-testid="cpf-label"
              className={cn(
                "prose prose-sm capitalize text-white 2xl:prose-lg group-hover:brightness-110",
                isCurrentPathMessages ? "hidden" : "hidden md:block",
              )}
            >
              {label}
            </span>
          </button>
        </li>
      </DialogTrigger>
      <DialogContent className="aspect-square max-h-[400px] w-full max-w-screen-sm gap-0 rounded-lg border-black-1 bg-black p-0 text-white">
        <DialogHeader className="flex h-11 flex-row items-center justify-between border-b border-black-1 p-2">
          <button
            onClick={
              activeField === "media"
                ? undefined
                : () => setActiveField("media")
            }
            className="disabled:cursor-not-allowed disabled:opacity-50"
            disabled={activeField === "media"}
            type="button"
            name="back"
            title="back"
          >
            <ArrowLeft />
          </button>
          <p className="font-semibold">Create new post</p>
          <button
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
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePost)}
            className="relative h-full max-h-[400px] min-h-[400px] min-w-full space-y-0"
          >
            {activeField === "media" &&
              (preview ? (
                <div className="group relative h-full max-h-[400px] min-w-full">
                  <Image
                    className="aspect-auto rounded-b-lg object-cover object-center"
                    fill
                    sizes="500px"
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 500))}`}
                    src={preview.media}
                    alt="preview"
                  />
                  <button
                    onClick={reset}
                    type="button"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
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
                          className="mx-auto flex size-40 w-full max-w-64 flex-col items-center justify-center gap-3"
                        >
                          <Upload size={50} />
                          <p
                            className="w-full cursor-pointer rounded-md bg-blue-500 p-2 text-center hover:bg-blue-500/50"
                            role="button"
                          >
                            Upload file from your computer
                          </p>
                        </label>
                        <input
                          accept="image/*"
                          multiple={false}
                          onChange={(e) => handleChange(e, "media")}
                          type="file"
                          name="media"
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
                        className="h-full w-full bg-transparent focus-visible:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {activeField === "captions" && isValid && (
              <div className='flex items-center absolute bottom-0 w-full'>
                <Button
                  disabled={!isChanged || isSubmitting || !isValid}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed rounded-none disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </Button>
                <Button
                  onClick={async () => {
                    setIsDraft(true)
                    await handlePost(form.getValues())
                  }}
                  disabled={!isChanged || isSubmitting || !isValid}
                  type="button"
                  className="w-full  bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed rounded-none disabled:opacity-50"
                >
                  Save as draft
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
