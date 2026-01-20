import type { Metadata } from "next";
import React from "react";
//@ts-ignore
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Smpley Learn It",
    description: "#1 Study App for students",
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
