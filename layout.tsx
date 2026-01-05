import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "College Match",
  description: "In a few clicks, find colleges that match with your academic profile and personal preferences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">{children}</main>
      </body>
    </html>
  );
}
