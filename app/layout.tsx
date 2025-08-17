import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./additional-styles.css";
import { RootLayoutClient } from "@/components/root-layout-client";

// Correct metadata definition
export const metadata: Metadata = {
  title: process.env.COMPANY_NAME,
  description: process.env.COMPANY_DESCRIPTION,
  icons: {
    icon: process.env.COMPANY_LOGOICO,
    shortcut: process.env.COMPANY_LOGOICO,
    apple: process.env.COMPANY_LOGO,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <RootLayoutClient>
          <div className=""></div>
          {children}
        </RootLayoutClient>
        {/* Thêm các script hoặc link khác nếu cần */}
      </body>
    </html>
  );
}