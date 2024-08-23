import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


export default function Notifications({ children }: { children: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent
                side={"left"}
                className="border-black-1 bg-black text-white"
            >
                <header className="border-b pb-2  border-black-1/50 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <button className="text-blue-500 text-xs ">Mark all as read</button>
                </header>
            </SheetContent>
        </Sheet>
    );
}
