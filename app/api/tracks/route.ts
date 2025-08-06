import { type NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"
import { AuthorizationService } from "@/lib/authorization-service"
import { authenticateUser } from "@/lib/auth-service"
import type { User } from "@/types/user"
import type { PrismaTrack } from "@/types/submission"
import { logger } from "@/lib/logger"

// Helper function để lấy user từ request (sử dụng session, token, etc.)
async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    // Trong production, bạn sẽ parse JWT token hoặc session
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

// GET method - fetch tracks by submission ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get("submissionId")

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required",
        },
        { status: 400 },
      )
    }

    console.log("📋 Get tracks for submission:", submissionId)

    // Lấy user hiện tại từ request
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

    // Get tracks by submission ID
    const result = await multiDB.getTracksBySubmissionId(submissionId)

    if (result.success) {
      console.log(`✅ Tracks retrieved successfully - Count: ${result.data?.length || 0}`)

      const response = NextResponse.json({
        success: true,
        data: result.data,
        count: result.data?.length || 0,
        userRole: currentUser.role
      })

      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      return response
    } else {
      const errorResponse = NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to retrieve tracks",
        },
        { status: 500 },
      )

      errorResponse.headers.set('Access-Control-Allow-Origin', '*')
      return errorResponse
    }
  } catch (error) {
    console.error("❌ Get tracks error:", error)
    const errorResponse = NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve tracks",
      },
      { status: 500 },
    )

    errorResponse.headers.set('Access-Control-Allow-Origin', '*')
    return errorResponse
  }
}

// POST method - create individual track
export async function POST(request: NextRequest) {
  try {
    const trackData = await request.json();
    logger.info('API Track POST - input', trackData);

    // Lấy user hiện tại từ request
    const currentUser = await getUserFromRequest(request)

    if (!currentUser) {
      logger.warn('API Track POST - Auth failed');
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // Validate required fields
    if (!trackData.title || !trackData.submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Track title and submission ID are required",
        },
        { status: 400 },
      )
    }

    // Prepare track data
    const track: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt'> = {
      title: trackData.title,
      artist: trackData.artist || '',
      filePath: trackData.filePath || '',
      duration: trackData.duration || 0,
      isrc: trackData.isrc || null,
      fileName: trackData.fileName || null,
      artistFullName: trackData.artistFullName || null,
      fileSize: trackData.fileSize || null,
      format: trackData.format || null,
      bitrate: trackData.bitrate || null,
      sampleRate: trackData.sampleRate || null,
      submissionId: trackData.submissionId
    };

    // Create track
    const result = await multiDB.createTrack(track)

    if (result.success) {
      logger.info('API Track POST - success', { id: result.data?.id });
      return NextResponse.json({
        success: true,
        message: "Track created successfully",
        data: result.data,
        userRole: currentUser.role
      })
    } else {
      logger.error('API Track POST - DB error', result.error);
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to create track",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    logger.error('API Track POST - Exception', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create track",
      },
      { status: 500 },
    )
  }
}

// PUT method - update track
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json()
    const trackId = updateData.id

    if (!trackId) {
      return NextResponse.json(
        {
          success: false,
          message: "Track ID is required",
        },
        { status: 400 },
      )
    }

    console.log("📝 Update track:", trackId)

    // Lấy user hiện tại từ request
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

    // Get existing track to check permissions
    const existingResult = await multiDB.getTrackById(trackId)

    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        {
          success: false,
          message: "Track not found",
        },
        { status: 404 },
      )
    }

    // TODO: Add permission check based on submission ownership

    // Prepare update data
    const updateTrack = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    }

    // Update track
    const result = await multiDB.updateTrack(trackId, updateTrack)

    if (result.success) {
      console.log("✅ Track updated successfully")
      return NextResponse.json({
        success: true,
        message: "Track updated successfully",
        data: result.data,
        userRole: currentUser.role
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to update track",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Update track error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update track",
      },
      { status: 500 },
    )
  }
}

// DELETE method - remove track
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackId = searchParams.get("id")

    if (!trackId) {
      return NextResponse.json(
        {
          success: false,
          message: "Track ID is required",
        },
        { status: 400 },
      )
    }

    console.log("🗑️ Delete track:", trackId)

    // Lấy user hiện tại từ request
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

    // Check permissions (only Label Manager can delete tracks)
    const canDelete = AuthorizationService.canDeleteSubmission(currentUser)

    if (!canDelete.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: canDelete.reason || "Permission denied",
        },
        { status: 403 },
      )
    }

    // Delete track
    const result = await multiDB.deleteTrack(trackId)

    if (result.success) {
      console.log("✅ Track deleted successfully")
      return NextResponse.json({
        success: true,
        message: "Track deleted successfully",
        id: trackId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to delete track",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Delete track error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete track",
      },
      { status: 500 },
    )
  }
}

// OPTIONS method cho CORS
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