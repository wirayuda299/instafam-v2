import { toast } from "sonner";
import type { ZodIssue } from "zod";

type ErrorRes =
  | {
      errors: ZodIssue[];
    }
  | {
      errors: string;
    }
  | undefined;

export const handleError = (error: ErrorRes, message?: string) => {
  if (error && "errors" in error && Array.isArray(error.errors)) {
    return error.errors.forEach((err) => {
      toast.error(err.message);
    });
  } else if (error && "errors" in error && !Array.isArray(error.errors)) {
    return toast.error(error.errors);
  } else {
    return toast.error(message);
  }
};
