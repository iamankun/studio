import { type NextRequest, NextResponse } from "next/server"
import { authenticateUserWithDatabase } from "@/lib/database-auth"
import { getSession } from "@/lib/session"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    logger.info("Login attempt", { username }, { component: "LoginAPI" })

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 },
      )
    }

    // Try admin account first (from env vars)
    const adminUsername = process.env.ADMIN_USERNAME || "ankunstudio"
    const adminPassword = process.env.ADMIN_PASSWORD || "@iamAnKun"
    
    let user = null
    
    if (username === adminUsername && password === adminPassword) {
      user = {
        id: "1",
        username: adminUsername,
        role: "Label Manager" as const,
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
    } else {
      // Try database authentication
      user = await authenticateUserWithDatabase(username, password)
    }

    console.log('DEBUG [Login Route]: Authentication result:', { success: !!user, user });
    if (user) {
      logger.info("Login successful", { userId: user.id }, { component: "LoginAPI" })

      // Lưu thông tin user vào session
      const session = await getSession()
      session.user = user
      await session.save()

      return NextResponse.json({
        success: true,
        user: user,
        message: "Login successful"
      })
    } else {
      logger.warn("Login failed", { username, reason: "Invalid credentials" }, { component: "LoginAPI" })
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    logger.error("Login API error", error, { component: "LoginAPI" })
    return NextResponse.json(
      {
        success: false,
        message: "Login failed due to an internal server error.",
      },
      { status: 500 },
    )
  }
}
