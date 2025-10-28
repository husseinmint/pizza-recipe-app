import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "وصفات البيتزا",
  description: "احفظ ونظم وصفات البيتزا المفضلة لديك",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`antialiased`} style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
