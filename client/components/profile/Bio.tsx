'use client'

import { FormEvent, useState } from "react"
import { toast } from "sonner"

import { updateUserBio } from "@/helper/users"

export default function Bio({ bio, userId }: { bio: string, userId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // @ts-ignore
      const bio = e.target.bio.value
      await updateUserBio(bio, userId, window.location.pathname)

    } catch (error) {
      toast.error((error as Error).message || "Failed to update bio")
    } finally {
      setIsOpen(false)
    }
  }

  const toogle = () => setIsOpen(prev => !prev)

  return (
    isOpen ? (
      <form onSubmit={handleSubmitForm} className="space-y-2">
        <textarea className="bg-transparent text-wrap focus-visible:outline-none" rows={1} cols={50} placeholder="Add bio..." name="bio" autoComplete="off" defaultValue={bio} />
        <div className="flex items-center gap-2" >
          <button type="submit" className="text-sm text-blue-600">Submit</button>
          <button type="button" onClick={toogle} className="text-sm text-red-500">Cancel</button>
        </div>
      </form>
    ) : (
      !bio ? (
        <button onClick={toogle}>Add bio</button>
      ) : (
        <p onClick={toogle} className="text-wrap break-words">{bio}</p>
      )
    )
  )
}