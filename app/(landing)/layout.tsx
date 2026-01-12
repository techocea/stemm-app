import React from "react";
//@ts-ignore
import "@/app/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "SmpleyLearnIt - AI Study Assistant",
    description:
        "SmpleyLearnIt is an AI-powered study platform that transforms lecture PDFs into concise summaries and practice quizzes. Perfect for students looking to optimize exam preparation with active recall and automated notes.",
    keywords: [
        "AI study assistant",
        "PDF to summary AI",
        "automatic study notes",
        "practice quiz generator",
        "exam prep AI",
        "student productivity tool",
        "active recall generator",
        "lecture note summarizer",
    ],
    openGraph: {
        title: "SmpleyLearnIt | Turn Lecture Notes into Exam Success",
        type: "website",
        url: "https://smpleylearnit.com",
        images: "https://smpleylearnit.com/og-image.jpg",
        siteName: "SmpleyLearnIt",
    },
    category: "Education / EdTech / AI Productivity",
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${plusJakartaSans.variable} font-sans bg-muted/50 antialiased`}
            >
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
