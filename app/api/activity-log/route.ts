import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, details, entityType, entityId, description } = body

    // Get current user session if available
    const session = await getSession()
    let userId = null

    if (session?.user?.id) {
      userId = session.user.id
    }

    // Try to create activity log entry in database with fallback
    let logEntry = null
    try {
      logEntry = await prisma.nhatKy.create({
        data: {
          action: action ?? 'Cần thêm hành động',
          details: {
            ...details,
            entityType,
            entityId,
            description,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
          },
          userId: userId
        }
      })

      logger.info("Activity logged to database", {
        logId: logEntry.id,
        action,
        userId,
        entityType,
        entityId
      }, { component: "ActivityLogAPI" })

    } catch (dbError) {
      // Fallback: log to console/file if database is unavailable
      logger.error("Database unavailable, logging to console only", dbError, { component: "ActivityLogAPI" })
      logger.info("Activity logged (fallback)", {
        action,
        userId,
        entityType,
        entityId,
        description,
        details
      }, { component: "ActivityLogAPI" })
    }

    return NextResponse.json({
      success: true,
      message: "Activity logged successfully",
      logId: logEntry?.id || 'fallback-mode',
      fallbackMode: !logEntry
    })
  } catch (error) {
    logger.error("Activity log API error", error, { component: "ActivityLogAPI" })
    return NextResponse.json(
      {
        success: false,
        message: "Failed to log activity",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    // Build where clause
    const where: { userId?: string; action?: string } = {}
    if (userId) where.userId = userId
    if (action) where.action = action

    // Get logs from database
    const logs = await prisma.nhatKy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length
    })
  } catch (error) {
    logger.error("Activity log GET API error", error, { component: "ActivityLogAPI" })
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve activity logs",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}