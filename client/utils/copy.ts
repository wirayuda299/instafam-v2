import { toast } from "sonner";

export function copyText(data: string, message: string) {
  navigator.clipboard.writeText(data).then(() => {
    toast.success(message);
  });
}
