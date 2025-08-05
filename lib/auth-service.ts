// An Kun Studio Digital Music Distribution System
// Production Authentication Service

import { multiDB } from "./database-api-service"
import type { User } from "@/types/user"

export interface AuthResult {
  success: boolean
  user?: User
  message?: string
  debug?: any
}

// Production authentication service
export async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  try {
    console.log("🔐 Authenticating user:", username)

    // Use database authentication
    const dbResult = await multiDB.authenticateUser(username, password)
    if (dbResult.success && dbResult.data) {
      console.log("✅ User authenticated via database:", dbResult.data)
      return dbResult
    }

    console.log("❌ Authentication failed for user:", username)
    return {
      success: false,
      message: "Invalid username or password"
    }

  } catch (error) {
    console.error("❌ Authentication error:", error)
    return {
      success: false,
      message: "Authentication service error",
      debug: error instanceof Error ? error.message : String(error)
    }
  }
}

// Register new user
export async function registerUser(userData: Partial<User>, password: string): Promise<AuthResult> {
  try {
    console.log("📝 Registering new user:", userData.username)

    // Basic validation
    if (!userData.username || !userData.email || !password) {
      return {
        success: false,
        message: "Username, email, and password are required"
      }
    }

    // Create new user via database
    const saveResult = await multiDB.createUser({
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName || userData.username,
      password: password,
      role: userData.role || "Artist"
    })

    if (saveResult.success) {
      console.log("✅ User registration successful")
      return {
        success: true,
        user: saveResult.data,
        message: "Registration successful"
      }
    } else {
      return {
        success: false,
        message: saveResult.message || "Registration failed"
      }
    }

  } catch (error) {
    console.error("❌ Registration error:", error)
    return {
      success: false,
      message: "Registration service error",
      debug: error instanceof Error ? error.message : String(error)
    }
  }
}

// Initialize auth system
export async function initializeAuth() {
  try {
    console.log("🔧 Initializing auth system...")

    // Test database connectivity
    const dbStatus = await multiDB.getStatus()
    console.log("📊 Database status:", dbStatus)

    return {
      success: true,
      message: "Auth system initialized",
      debug: { dbStatus }
    }
  } catch (error) {
    console.error("❌ Auth initialization error:", error)
    return {
      success: false,
      message: "Auth initialization failed",
      debug: error instanceof Error ? error.message : String(error)
    }
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<AuthResult> {
  try {
    console.log("👤 Getting user profile:", userId)

    // Database lookup for user profile
    // This would need to be implemented in database service
    return {
      success: false,
      message: "User profile lookup not implemented"
    }

  } catch (error) {
    console.error("❌ Get profile error:", error)
    return {
      success: false,
      message: "Profile service error",
      debug: error instanceof Error ? error.message : String(error)
    }
  }
}
