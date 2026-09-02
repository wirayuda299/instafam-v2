import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full items-center justify-center bg-black text-white md:min-h-screen">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );
}
