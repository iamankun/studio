"use client"

import React, { useState, useEffect } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { MainContentLayout } from "@/components/main-content-layout"
import { DynamicBackground } from "@/components/dynamic-background"
import { AiChatButton } from "@/components/ai-chat-button"
import { LoadingScreen } from "@/components/loading-screen"

interface RootLayoutClientProps {
    readonly children: React.ReactNode
    readonly className?: string
}

export function RootLayoutClient({ children, className }: RootLayoutClientProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        // Fix hydration mismatch: đảm bảo chỉ chạy trên client
        setIsClient(true)
        
        // Không cần timer ở đây, để LoadingScreen tự quản lý
        // Timer sẽ được handle bởi LoadingScreen component
    }, [])

    // Prevent hydration mismatch: render basic content on server
    if (!isClient) {
        return (
            <body className={className} suppressHydrationWarning>
                <div className="min-h-screen bg-black flex items-center justify-center">
                    <div className="text-white text-center">
                        <h1 className="text-2xl font-bold mb-2">An Kun Studio</h1>
                        <p className="text-gray-300">Đang tải...</p>
                    </div>
                </div>
            </body>
        )
    }

    return (
        <body className={className} suppressHydrationWarning>
            {isLoading ? (
                <LoadingScreen
                    title="An Kun Studio"
                    subtitle="Đang tải trang..."
                    duration={3000}
                    logoUrl="\loading.webm"
                    isAnimation={true}
                    onComplete={() => setIsLoading(false)}
                />
            ) : (
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                        <DynamicBackground />
                        <MainContentLayout>
                            {children}
                        </MainContentLayout>
                        <AiChatButton />
                    </AuthProvider>
                </ThemeProvider>
            )}
        </body>
    )
}
