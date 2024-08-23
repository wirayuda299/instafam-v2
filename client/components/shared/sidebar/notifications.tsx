import type { ReactNode } from "react";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import FollowButton from "../post-card/follow-button";


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

                <div className="p-2 flex flex-col gap-5">
                    <div className="flex gap-3">
                        <Image
                            className='min-w-[50px] object-cover object-center max-h-[50px] max-w-[50px]  min-h-[50px] rounded-full'
                            src={'https://utfs.io/f/c014de3a-f4fb-47e0-b6ec-98c3ee32db9d-87i6xj.png'}
                            width={45}
                            height={45}
                            alt="img" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold">Username</h3> <p className="text-xs text-gray-500">send you follow request</p>
                            </div>

                            <FollowButton styles="w-min bg-blue-500 px-3 py-1 rounded " userId="" userToFollow="" />
                        </div>
                    </div>


                    <div className="flex gap-3">
                        <Image
                            className='min-w-[50px] object-cover object-center max-h-[50px] max-w-[50px]  min-h-[50px] rounded-full'
                            src={'https://utfs.io/f/c014de3a-f4fb-47e0-b6ec-98c3ee32db9d-87i6xj.png'}
                            width={45}
                            height={45}
                            alt="img" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold">Username</h3> <p className="text-xs text-gray-500">send you follow request</p>
                            </div>
                            <FollowButton styles="w-min bg-blue-500 px-3 py-1 rounded " userId="" userToFollow="" />
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
