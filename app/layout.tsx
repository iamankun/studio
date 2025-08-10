import type { Metadata } from "next"
import { Dosis } from "next/font/google"
import { RootLayoutClient } from "@/components/root-layout-client"
import "./globals.css"
import "./additional-styles.css"

const dosis = Dosis({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-dosis",
})

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
      <RootLayoutClient className={dosis.className}>
        {children}
      </RootLayoutClient>
    </html>
  )
}