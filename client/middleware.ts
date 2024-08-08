import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks",
]);

export default clerkMiddleware(
  (auth, request, next) => {
    if (!isPublicRoute(request)) {
      auth().protect();
    } else {
      return NextResponse.next();
    }
  },
  {
    afterSignUpUrl: "/",
    afterSignInUrl: "/",
  },
);
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
