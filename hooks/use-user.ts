// Active: 1750877192019@@ep-mute - rice - a17ojtca - pooler.ap - southeast - 1.aws.neon.tech@5432@aksstudio
// Tôi là An Kun
// Hỗ trợ dự án, Copilot, Gemini
// Tác giả kiêm xuất bản bởi An Kun Studio Digital Music

"use client"

import { useAuth } from "@/components/auth-provider"
import type { User } from "@/types/user"

export interface UseUserReturn {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
    register: (userData: any) => Promise<{ success: boolean; message?: string }>
    logout: () => void
}

export function useUser(): UseUserReturn {
    const { user, login, register, logout, loading } = useAuth()

    return {
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        login,
        register,
        logout
    }
}
