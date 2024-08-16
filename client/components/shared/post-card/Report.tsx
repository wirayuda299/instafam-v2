'use client'

import { useState } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils";
import { handleError } from "@/utils/error";
import { REPORT_POST_REASONS } from "@/constants";


export default function ReportPost({ postId }: { postId: string }) {

	const [selectedReasons, setSelectedReasons] = useState<string[]>([])

	const handleSelectOrRemoveReason = (reason: string) => {
		if (selectedReasons.includes(reason)) {
			setSelectedReasons(prev => prev.filter(r => r !== reason))
		} else {
			setSelectedReasons(prev => prev.concat(reason))
		}
	}


	const handleReport = async () => {
		try {

			const { reportPost } = await import("@/actions/post")

			const reasons = await reportPost(postId, selectedReasons)
			if (reasons && "errors" in reasons) {
				handleError(reasons, "Failed to report post")
				return
			}

			toast.success("Post has been reported")
		} catch (e) {
			toast.error((e as Error).message || "Failed to report post")
		} finally {
			setSelectedReasons([])
		}
	}


	return (
		<Dialog onOpenChange={(isOpen) => !isOpen && setSelectedReasons([])}>
			<DialogTrigger asChild>
				<li className="flex w-full cursor-pointer items-center justify-center border-b border-gray-500/10 py-2 text-center text-sm text-red-600">
					Report
				</li>
			</DialogTrigger>
			<DialogContent className='bg-black-1 p-0 border-none'>
				<DialogTitle className="text-center py-3">
					Report Post
				</DialogTitle>
				<div className="flex flex-wrap p-3 text-center gap-3">
					{REPORT_POST_REASONS.map(reason => (
						<button title={reason} name={reason} onClick={() => handleSelectOrRemoveReason(reason)} key={reason} className={cn("border py-2 px-3 text-xs rounded-full cursor-pointer", selectedReasons.includes(reason) ? 'border-red-500' : '')}>
							{reason}
						</button>
					))}
				</div>
				<button onClick={handleReport} className="w-full bg-blue-500 p-2 rounded hover:bg-blue-700 transition-colors ease duration-300" title="report" name="report">
					Report
				</button>
			</DialogContent>
		</Dialog>
	)
}

