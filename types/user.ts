import { UserRole } from "@/types/prisma"
import type { PrismaUser } from "@/types/prisma"

// Legacy User interface for backward compatibility
export interface User {
  UID: string
  id: string // For backward compatibility
  userName: string
  username: string // For backward compatibility
  email: string
  fullName?: string
  password: string
  roles: UserRole[]
  role: string // For backward compatibility
  labelId?: string
  createdAt: Date
  updatedAt: Date
}

// Re-export from Prisma types
export { UserRole, PrismaUser }