import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Instafam",
    template: "%s - Instafam",
  },
  description: "Social media app ",
};

export const viewport: Viewport = {
  themeColor: "black",
  maximumScale: 1,
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} mx-auto max-w-(--breakpoint-2xl) overflow-hidden bg-black text-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
