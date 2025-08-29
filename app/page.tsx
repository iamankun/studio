"use client"
import { Auth } from "@/components/auth"
import MainAppView from "@/components/main-app-view"

export default function HomePage() {
  return (
    <Auth>
      <MainAppView />
    </Auth>
  );
}

