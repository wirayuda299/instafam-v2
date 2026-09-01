"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function Bio({ bio, userId }: { bio: string; userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bio = new FormData(e.currentTarget).get("bio") as string;
    if (bio.length > 100) {
      toast.error("Bio too long");
      return;
    }

    setIsSubmitting(true);
    try {
      const { updateUserBio } = await import("@/helper/users");

      await updateUserBio(bio, userId, window.location.pathname);
    } catch (error) {
      toast.error((error as Error).message || "Failed to update bio");
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const toggle = () => setIsOpen((prev) => !prev);

  return isOpen ? (
    <form onSubmit={handleSubmitForm} className="space-y-2">
      <textarea
        maxLength={100}
        minLength={1}
        className="w-full bg-transparent text-wrap text-white placeholder:text-white/40 focus-visible:outline-hidden"
        rows={1}
        cols={50}
        placeholder="Add bio..."
        name="bio"
        autoComplete="off"
        defaultValue={bio}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-sm font-semibold text-blue-500 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Saving..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={toggle}
          disabled={isSubmitting}
          className="text-sm text-white/50 transition-colors hover:text-white/80 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  ) : !bio ? (
    <button
      onClick={toggle}
      className="text-sm text-white/50 transition-colors hover:text-white/80"
    >
      Add bio
    </button>
  ) : (
    <p
      onClick={toggle}
      className="cursor-pointer text-wrap break-words text-white/80 transition-colors hover:text-white"
    >
      {bio}
    </p>
  );
}
