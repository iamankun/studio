export interface User {
  id: string
  username: string
  role: string
  fullName: string
  email: string
  avatar: string
  bio: string
  socialLinks: {
    facebook: string
    youtube: string
    spotify: string
    appleMusic: string
    tiktok: string
    instagram: string
  }
  createdAt: string
  isrcCodePrefix?: string
  backgroundSettings?: {
    type: string
    gradient: string
    videoUrl: string
    opacity: number
    playlist: string
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem("aks_user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function storeUser(user: User): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem("aks_user", JSON.stringify(user))
  } catch (error) {
    console.error("Failed to store user:", error)
  }
}

export function clearUser(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem("aks_user")
  } catch (error) {
    console.error("Failed to clear user:", error)
  }
}

import type { User } from '@/types/user';
import { authenticateUserWithDatabase } from './database-auth'

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  // Sử dụng credentials từ .env.local
  const adminUsername = process.env.ADMIN_USERNAME || "ankunstudio"
  const adminPassword = process.env.ADMIN_PASSWORD || "@iamAnKun"

  if (username === adminUsername && password === adminPassword) {
    return {
      id: "1",
      username: adminUsername,
      role: "Label Manager",
      fullName: process.env.COMPANY_NAME || "An Kun Studio Digital Music Distribution",
      email: process.env.COMPANY_EMAIL || "admin@ankun.dev",
      avatar: process.env.COMPANY_AVATAR || "/face.png",
      bio: process.env.COMPANY_DESCRIPTION || "Send Gift Your Song to The World",
      socialLinks: {
        facebook: "",
        youtube: "",
        spotify: "",
        appleMusic: "",
        tiktok: "",
        instagram: "",
      },
      createdAt: new Date().toISOString(),
      isrcCodePrefix: "VNA2P",
    }
  }

  // Fallback to database authentication
  return await authenticateUserWithDatabase(username, password)
}

export function updateUser(userData: Partial<User>): boolean {
  const currentUser = getStoredUser()
  if (!currentUser) return false

  const updatedUser = { ...currentUser, ...userData }
  storeUser(updatedUser)
  return true
}
