import type { ReactNode } from "react";
import { Toaster } from "sonner";

import Sidebar from "@/components/shared/sidebar";
import MainHeader from "@/components/shared/main-header";

export default function Main({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <Sidebar />
      <div className="w-full">
        <MainHeader />
        {children}
      </div>
      <Toaster />
    </div>
  );
}
