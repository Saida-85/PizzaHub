import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PizzaHub — Hot & Fresh Pizza Delivered to Your Door",
  description:
    "Discover local wood-fired pizzerias, customize gourmet pies, and track fresh orders from oven to table.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0B1315] text-slate-100 selection:bg-[#E05A2B] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>

        <Toaster
          theme="dark"
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#132024",
              border: "1px solid rgba(212, 163, 89, 0.3)",
              color: "#f8fafc",
            },
          }}
        />
      </body>
    </html>
  );
}
