import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AuthInit from "./AuthInit";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Intelligence",
  description:
    "AI-powered career intelligence for resume analysis, skill gap detection, career guidance, and job recommendations.",
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><AuthInit>{children}</AuthInit></body>
    </html>
  );
}
