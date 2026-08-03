import "./globals.css"
import type { Metadata, Viewport } from "next"
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
  title: "STEMM | AI Academic Assistant for Science & Management Students",
  description:
    "Upload any PDF textbook, research paper, or case study to STEMM. Our AI instantly extracts formulas, synthesizes business studies, and generates interactive quizzes without prompt friction.",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "AI study assistant for university",
    "PDF to study guide AI",
    "science student AI tool",
    "management case study AI solver",
    "STEM college AI app",
    "avoid LLM prompt engineering for studying",
  ],
  authors: [{ name: "STEMM Team", url: "https://stemm.app" }],
  creator: "STEMM",
  publisher: "STEMM Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stemm.app",
    title: "STEMM | AI Academic Assistant for University Students",
    description:
      "Drop your academic PDFs and let STEMM cook. The ultimate all-in-one AI study engine built specifically for Science and Management students.",
    siteName: "STEMM",
    images: [
      {
        url: "https://stemm.appog-image.png",
        width: 1200,
        height: 630,
        alt: "STEMM AI Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STEMM | AI Academic Assistant for University Students",
    description:
      "Stop wrestling with raw LLM prompts. Upload complex PDFs and get instant, structured study blueprints tailored to your major.",
    images: ["https://stemm.appog-image.png"],
    creator: "@stemm_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

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
