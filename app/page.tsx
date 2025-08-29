"use client"
import { Auth } from "@/components/auth"
import { AuthProvider } from "@/components/auth-provider"
import MainAppView from "@/components/main-app-view"

export default function HomePage() {
  return (
    <AuthProvider>
      <Auth>
        <MainAppView />
      </Auth>
    </AuthProvider>
  );
}

