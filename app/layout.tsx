import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
              <Header />
              <main className="p-4">{children}</main>
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
