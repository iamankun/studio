import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test database configuration thay vì gọi API service (tránh infinite loop)
    const dbUrl = process.env.DATABASE_URL
    const hasDbUrl = !!dbUrl
    const isValidDbUrl = dbUrl?.startsWith('postgresql://') || dbUrl?.startsWith('postgres://')

    const status = {
      api: true, // API đang chạy
      prisma: hasDbUrl && isValidDbUrl,
      database: hasDbUrl && isValidDbUrl,
    }

    let primary: string = "api";
    if (status.database) {
      primary = "database";
    } else if (status.prisma) {
      primary = "prisma";
    } else if (status.api) {
      primary = "api";
    } else {
      primary = "none";
    }

    return NextResponse.json({
      success: true,
      message: "Database status retrieved",
      databases: {
        api: {
          available: status.api,
          description: "API - Primary Database Service",
        },
        prisma: {
          available: status.prisma,
          description: "Prisma - ORM Database",
        },
        database: {
          available: status.database,
          description: "Direct Database Connection",
        },
      },
      primary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database status error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get database status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
