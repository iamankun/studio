import type { Metadata } from "next"
import { RootLayoutClient } from "@/components/root-layout-client"
import "./globals.css"
import "./additional-styles.css"

// Using local font fallback instead of Google Fonts for build reliability
const fontClass = "font-sans"

export const metadata: Metadata = {
  title: process.env.COMPANY_NAME,
  description: process.env.COMPANY_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href={process.env.COMPANY_LOGOICO} />
      </head>
      <RootLayoutClient className={fontClass}>
        {children}
      </RootLayoutClient>
    </html>
  )
}