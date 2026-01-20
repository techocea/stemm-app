import React from "react";
//@ts-ignore
import "@/app/globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Plus_Jakarta_Sans } from "next/font/google";
import FeedbackModal from "@/components/shared/FeedbackModal";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smpley Learn It | Study Smarter, Not Harder",
  description:
    "Transform long lecture notes into concise summaries and practice questions instantly. Save hours of study time and master your courses with Smpley Learn It.",
  icons: {
    icon: "/logo.png",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans bg-muted/50 antialiased`}
      >
        <Toaster position="top-center" />
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 lg:ml-52 min-h-screen">
              <DashboardNavbar />
              <main className="flex-1 px-4 py-8 lg:px-10 overflow-y-auto">
                {children}
                <FeedbackModal />
              </main>
            </div>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
