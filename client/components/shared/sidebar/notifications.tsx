import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Props = {
  children: ReactNode;
};

export default function Notifications({ children }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={"left"}
        className="border-black-1 bg-black text-white"
      >
        Notifications
      </SheetContent>
    </Sheet>
  );
}
