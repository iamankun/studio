import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test environment variables
    const dbUrl = process.env.DATABASE_URL
    const nodeEnv = process.env.NODE_ENV
    
    // Simple connection test
    console.log("🔍 Testing database connection...")
    console.log("DB URL exists:", !!dbUrl)
    console.log("Node ENV:", nodeEnv)
    
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL not found",
        env: {
          NODE_ENV: nodeEnv,
          DATABASE_URL_EXISTS: false
        }
      }, { status: 500 })
    }

    // Test database URL format
    const urlPattern = /^postgresql:\/\//
    const isValidUrl = urlPattern.test(dbUrl)
    
    return NextResponse.json({
      success: true,
      message: "Database configuration test",
      env: {
        NODE_ENV: nodeEnv,
        DATABASE_URL_EXISTS: true,
        DATABASE_URL_VALID: isValidUrl,
        DATABASE_URL_PREVIEW: dbUrl.substring(0, 30) + "..."
      }
    })
    
  } catch (error) {
    console.error("❌ Database test error:", error)
    return NextResponse.json({
      success: false,
      error: "Database test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
