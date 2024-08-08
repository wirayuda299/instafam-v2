import type { ReactNode } from "react";

export default function Auth({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      {children}
    </main>
  );
}
