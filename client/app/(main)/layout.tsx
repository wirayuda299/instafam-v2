import { auth } from "@clerk/nextjs/server";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import Sidebar from "@/components/shared/sidebar";
import MainHeader from "@/components/shared/main-header";
import { SocketContextProvider } from "@/context/socket";

export default async function Main({ children }: { children: ReactNode }) {
  await auth.protect();
  return (
    <SocketContextProvider>
      <div className="flex gap-2">
        <Sidebar />
        <div className="w-full">
          <MainHeader />
          {children}
        </div>
        <Toaster />
      </div>
    </SocketContextProvider>
  );
}
