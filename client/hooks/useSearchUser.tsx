import { useState, useEffect, useRef, ChangeEvent } from "react";
import { toast } from "sonner";

import { handleError } from "@/utils/error";
import { debounce } from "@/utils/debounce";
import { User } from "@/types";

export default function useSearchUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSave = useRef(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      if (!value) setSearchResult([]);
    }),
  ).current;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => debouncedSave(e);

  useEffect(() => {
    if (!searchQuery) return;

    (async () => {
      setLoading(true);
      try {
        const { searchUser } = await import("@/helper/users");
        const users = await searchUser(searchQuery.toLowerCase());

        if (users && "errors" in users) {
          handleError(users, "Failed to search user");
          return;
        }

        if (users.length < 1) {
          toast.error("User not found");
          return;
        }
        setSearchResult(users);
      } catch (e) {
        toast.error((e as Error).message || "Failed to search user");
      } finally {
        setLoading(false);
      }
    })();
  }, [searchQuery]);

  return {
    handleChange,
    searchResult,
    searchQuery,
    loading,
  };
}
