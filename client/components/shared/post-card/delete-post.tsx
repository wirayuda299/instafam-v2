"use client";

import { useState } from "react";
import { toast } from "sonner";

import { handleError } from "@/utils/error";
import { deletePost } from "@/actions/post";

const fallbackErrorMessage = "Failed to delete post";

type Props = { fileId: string; postId: string; postAuthor: string };

export default function DeletePost({ fileId, postId, postAuthor }: Props) {
	const [isLoading, setIsLoading] = useState(false);

	const handleDeletePost = async () => {
		try {
			setIsLoading(true);
			const deletedFile = await deletePost(
				fileId,
				postId,
				postAuthor,
				window.location.pathname,
			);
			if (deletedFile && "errors" in deletedFile) {
				handleError(deletedFile, fallbackErrorMessage);
				return;
			}
			toast.success("Post successfully deleted");
		} catch (error) {
			toast.error((error as Error).message || fallbackErrorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={handleDeletePost}
			aria-disabled={isLoading}
			title="delete"
			name="delete"
			disabled={isLoading}
			className="flex w-full items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm text-red-600 disabled:cursor-not-allowed"
		>
			Delete
		</button>
	);
}
