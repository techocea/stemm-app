import "./globals.css"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
// import Header from "@/components/header"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "STEM Academic Study & Exam Solver Studio",
  description:
    "Automated study content generation from user-uploaded PDFs, generating publication-grade Dynamic Short Notes, Mock Model Papers, and Simulated Past Papers with step-by-step marking rubrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
    >
      <body>
        <SidebarProvider>
          <TooltipProvider>
            <AppSidebar />
            <div className="flex w-full flex-1 flex-col">
              {/* <Header /> */}
              <main className="p-4">{children}</main>
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
