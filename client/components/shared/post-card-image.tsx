import Image from "next/image"
import Link from "next/link"


import { Post } from "@/types"
import { shimmer, toBase64 } from "@/utils/image-loader"


export default function PostCardImage({ post }: { post: Post }) {

  return (
    <Link href={`/post/${post.post_id}`}>
      <Image
        className="aspect-square h-full max-h-[300px] w-full max-w-[300px] rounded-lg border border-gray-600 object-cover object-center"
        sizes="400px"
        src={post.media_url}
        priority={true}
        loading={"eager"}
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(500, 400))}`}
        width={500}
        height={500}
        alt="attachment"
      />
    </Link>

  )

}
