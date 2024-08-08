import { Bot } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
      <Bot className="animate-pulse" size={80} />
    </div>
  );
}
