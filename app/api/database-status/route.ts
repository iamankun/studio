import { NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"

export async function GET() {
  try {
    const status = await multiDB.getStatus()

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
