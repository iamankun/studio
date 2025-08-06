import { type NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"
import { AuthorizationService } from "@/lib/authorization-service"
import { authenticateUser } from "@/lib/auth-service"
import type { User } from "@/types/user"
import type { PrismaSubmission, PrismaTrack } from "@/types/submission"
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

export async function POST(request: NextRequest) {
  try {
    const { submission, tracks } = await request.json();
    logger.info('API Submission with tracks POST - input', { 
      title: submission?.title, 
      trackCount: tracks?.length 
    });

    // Lấy user hiện tại từ request
    const currentUser = await getUserFromRequest(request)

    if (!currentUser) {
      logger.warn('API Submission with tracks POST - Auth failed');
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // Validate input data
    if (!submission || !tracks || !Array.isArray(tracks)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: submission and tracks array are required",
        },
        { status: 400 },
      )
    }

    // Ensure submission belongs to current user
    const submissionData: Omit<PrismaSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
      ...submission,
      userId: currentUser.id,
      labelId: submission.labelId || currentUser.labelId || ''
    };

    // Validate tracks data
    const tracksData: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt' | 'submissionId'>[] = tracks.map((track: any) => ({
      title: track.title || '',
      artist: track.artist || submission.artist,
      filePath: track.filePath || '',
      duration: track.duration || 0,
      isrc: track.isrc || null,
      fileName: track.fileName || null,
      artistFullName: track.artistFullName || null,
      fileSize: track.fileSize || null,
      format: track.format || null,
      bitrate: track.bitrate || null,
      sampleRate: track.sampleRate || null
    }));

    // Create submission with tracks using the database service
    const result = await multiDB.createSubmissionWithTracks(submissionData, tracksData);

    if (result.success) {
      logger.info('API Submission with tracks POST - success', { 
        id: result.data?.submission.id,
        trackCount: result.data?.tracks.length 
      });

      const response = NextResponse.json({
        success: true,
        message: "Submission with tracks created successfully",
        data: result.data,
        userRole: currentUser.role
      })

      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      return response
    } else {
      logger.error('API Submission with tracks POST - DB error', result.error);
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to create submission with tracks",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    logger.error('API Submission with tracks POST - Exception', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create submission with tracks",
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