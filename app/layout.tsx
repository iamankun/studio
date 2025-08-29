import Metadata from "next";
import React from "react";
import "@/app/globals.css";
import "@/app/additional-styles.css";
import { RootLayoutClient } from "@/components/root-layout-client";

// Correct metadata definition
export const Metadata: Metadata = {
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
}: Readonly<{ children: React }>) {
  return (
    <html lang="En" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-dosis">
        <RootLayoutClient>
          <div className=""></div>
          {children}
        </RootLayoutClient>
        {/* Thêm các script hoặc link khác nếu cần */}
      </body>
    </html>
  );
}