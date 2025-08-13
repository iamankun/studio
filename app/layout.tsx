import type { Metadata } from "next"
import { RootLayoutClient } from "@/components/root-layout-client"
import "./globals.css"
import "./additional-styles.css"

// Sử dụng font Dosis làm mặc định cho toàn bộ giao diện
const fontClass = "font-dosis"

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
        <link rel={process.env.COMPANY_LOGOICO} />
      </head>
      <RootLayoutClient className={fontClass}>
        {children}
      </RootLayoutClient>
    </html>
  )
}