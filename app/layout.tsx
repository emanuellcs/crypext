import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CrypExt - Cryptocurrency Price Tracker",
  description:
    "Track real-time cryptocurrency prices with beautiful charts and analytics. Modern dark UI with live market data.",
  keywords: "cryptocurrency, bitcoin, ethereum, price tracker, crypto market, dark mode, real-time",
  authors: [{ name: "Emanuel Lázaro" }],
  creator: "Emanuel Lázaro",
  openGraph: {
    title: "CrypExt - Cryptocurrency Price Tracker",
    description: "Track real-time cryptocurrency prices with beautiful charts and analytics",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CrypExt - Cryptocurrency Price Tracker",
    description: "Track real-time cryptocurrency prices with beautiful charts and analytics",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-black text-zinc-100">
            <main className="pb-20">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
