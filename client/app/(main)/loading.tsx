import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );
}
