/// <reference types="node" />

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { AuthorizationService } from "@/lib/authorization-service"
import { authenticateUser } from "@/lib/auth-service"
import type { User } from "@/types/user"
import { Submission, toSimpleSubmission } from "@/types/submission"
import { logger } from "@/lib/logger"

// Helper function to get user from request (using session, token, etc.)
async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    // In production, you will parse JWT token or session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return null

    const [type, credentials] = authHeader.split(' ')
    if (type !== 'Basic') return null

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')

    const authResult = await authenticateUser(username, password)
    return authResult.success ? authResult.user || null : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const includeStats = searchParams.get("stats") === "true"

    console.log("📋 Database Get submissions for:", username || "all users")

    // Get current user from request
    const currentUser = await getUserFromRequest(request)

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 },
      )
    }

    // Get all submissions from Prisma
    const prismaSubmissions = await prisma.submission.findMany({
      where: username ? { user: { username: username } } : {},
      include: { user: true }
    });

    const allSubmissions: Submission[] = prismaSubmissions.map((s: any) => ({
      id: s.id,
      track_title: s.title,
      artist_name: s.artistName,
      genre: s.genre,
      status: s.status,
      submission_date: s.submissionDate?.toISOString().split('T')[0],
      created_at: s.createdAt.toISOString(),
      user_id: s.userId,
      artist_id: s.userId,
      cover_art_url: s.artworkPath,
      artwork_path: s.artworkPath,
      audio_file_url: s.audioUrl,
      audioUrl: s.audioUrl
    }));
    
    // Convert Submission[] to SimpleSubmission[]
    const simpleSubmissions = allSubmissions.map(toSimpleSubmission);
    
    // Filter submissions based on user's permissions
    const filteredSimpleSubmissions = AuthorizationService.filterSubmissionsForUser(
      currentUser,
      simpleSubmissions
    )

    const filteredIds = new Set(filteredSimpleSubmissions.map(s => s.id));
    const filteredFullSubmissions = allSubmissions.filter(s => filteredIds.has(s.id));

    console.log(`✅ Submissions retrieved successfully - User: ${currentUser.role}, Count: ${filteredFullSubmissions.length}`)

    const responseData = {
      success: true,
      data: filteredFullSubmissions,
      count: filteredFullSubmissions.length,
      userRole: currentUser.role,
      canViewAll: currentUser.role === "Label Manager",
      statistics: includeStats ? AuthorizationService.generateUserStatistics(
        currentUser,
        simpleSubmissions
      ) : undefined
    }

    const response = NextResponse.json(responseData)

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
    
  } catch (error) {
    console.error("❌ Get submissions error:", error)
    logger.error("API GET /api/submissions Exception", error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve submissions",
      },
      { status: 500 },
    )

    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    return errorResponse
  }
}

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json();
    logger.info('API Submission POST - input', submissionData);

    // Get current user from request
    const currentUser = await getUserFromRequest(request)

    if (!currentUser) {
      logger.warn('API Submission POST - Auth failed');
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // Handle legacy submission creation (backward compatibility)
    // remove any client-sent id
    const { id, created_at, submission_date, user_id, artist_id, ...submissionPayload } = submissionData; 

    const newSubmission = await prisma.submission.create({
        data: {
            ...submissionPayload,
            title: submissionData.track_title || submissionData.title,
            artistName: submissionData.artist_name,
            userId: currentUser.id,
            status: submissionData.status ?? "pending",
            submissionDate: new Date(),
        }
    });

    logger.info('API Submission POST - legacy success', { id: newSubmission.id });
    return NextResponse.json({
      success: true,
      message: "Submission created successfully",
      data: newSubmission,
      id: newSubmission.id,
      userRole: currentUser.role
    })

  } catch (error) {
    logger.error('API Submission POST - Exception', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create submission",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 },
    )
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}