import { type NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"
import { AuthorizationService } from "@/lib/authorization-service"
import { authenticateUser } from "@/lib/auth-service"
import type { User } from "@/types/user"
import { toSimpleSubmission } from "@/types/submission"
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const includeStats = searchParams.get("stats") === "true"

    console.log("📋 Database Get submissions for:", username || "all users")

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

    // Lấy tất cả submissions
    const result = await multiDB.getSubmissions(username || undefined);

    if (result.success && result.data) {
      // Convert Submission[] to SimpleSubmission[]
      const simpleSubmissions = result.data.map(toSimpleSubmission);
      
      // Filter submissions dựa trên quyền của user
      const filteredSubmissions = AuthorizationService.filterSubmissionsForUser(
        currentUser,
        simpleSubmissions
      )

      console.log(`✅ Submissions retrieved successfully - User: ${currentUser.role}, Count: ${filteredSubmissions.length}`)

      const responseData = {
        success: true,
        data: filteredSubmissions,
        count: filteredSubmissions.length,
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
    } else {
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
  } catch (error) {
    console.error("❌ Get submissions error:", error)
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

    // Lấy user hiện tại từ request
    const currentUser = await getUserFromRequest(request)

    if (!currentUser) {
      logger.warn('API Submission POST - Auth failed');
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    // Check if this is a relational submission (has submission and tracks)
    if (submissionData.submission && submissionData.tracks) {
      // Handle relational submission creation
      const result = await multiDB.createSubmissionWithTracks(
        submissionData.submission,
        submissionData.tracks
      );

      if (result.success) {
        logger.info('API Submission POST - relational success', { 
          id: result.data?.submission.id,
          trackCount: result.data?.tracks.length 
        });
        return NextResponse.json({
          success: true,
          message: "Submission with tracks created successfully",
          data: result.data,
          userRole: currentUser.role
        })
      } else {
        logger.error('API Submission POST - relational DB error', result.error);
        return NextResponse.json(
          {
            success: false,
            message: result.message || "Failed to create submission with tracks",
          },
          { status: 500 },
        )
      }
    } else {
      // Handle legacy submission creation (backward compatibility)
      const submission = {
        id: `sub-${Date.now()}`,
        ...submissionData,
        user_id: currentUser.id, // Đảm bảo submission thuộc về user hiện tại
        artist_id: currentUser.id, // Nếu là artist
        status: submissionData.status ?? "pending",
        submission_date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
      }

      // Use multiDB (NEON) - legacy method
      const result = await multiDB.createSubmission(submission)

      if (result.success) {
        logger.info('API Submission POST - legacy success', { id: submission.id });
        return NextResponse.json({
          success: true,
          message: "Submission created successfully",
          data: result.data,
          id: submission.id,
          userRole: currentUser.role
        })
      } else {
        logger.error('API Submission POST - legacy DB error', result.error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create submission",
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    logger.error('API Submission POST - Exception', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create submission",
      },
      { status: 500 },
    )
  }
}

// PUT method cho update submissions
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json()
    const submissionId = updateData.id

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required",
        },
        { status: 400 },
      )
    }

    console.log("📝 Update submission:", submissionId)

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

    // Lấy submission hiện tại để kiểm tra quyền
    const existingResult = await multiDB.getSubmissionById(submissionId)

    if (!existingResult.success || !existingResult.data) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found",
        },
        { status: 404 },
      )
    }

    const existingSubmission = existingResult.data

    // Kiểm tra quyền chỉnh sửa
    const canEdit = AuthorizationService.canEditSubmission(currentUser, toSimpleSubmission(existingSubmission))

    if (!canEdit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: canEdit.reason || "Permission denied",
        },
        { status: 403 },
      )
    }

    // Validate release date nếu có thay đổi
    if (updateData.releaseDate && updateData.releaseDate !== existingSubmission.releaseDate) {
      const dateValidation = AuthorizationService.validateReleaseDate(
        currentUser,
        toSimpleSubmission(existingSubmission),
        updateData.release_date
      )

      if (!dateValidation.allowed) {
        return NextResponse.json(
          {
            success: false,
            message: dateValidation.reason || "Invalid release date",
          },
          { status: 400 },
        )
      }
    }

    // Prepare update data
    const updateSubmission = {
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    // Update submission
    const result = await multiDB.updateSubmission(submissionId, updateSubmission)

    if (result.success) {
      console.log("✅ Submission updated successfully")
      return NextResponse.json({
        success: true,
        message: "Submission updated successfully",
        id: submissionId,
        userRole: currentUser.role
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update submission",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Update submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update submission",
      },
      { status: 500 },
    )
  }
}

// DELETE method cho xóa submissions
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get("id")

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required",
        },
        { status: 400 },
      )
    }

    console.log("🗑️ Delete submission:", submissionId)

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

    // Kiểm tra quyền xóa (chỉ Label Manager)
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

    // Delete submission
    const result = await multiDB.deleteSubmission(submissionId)

    if (result.success) {
      console.log("✅ Submission deleted successfully")
      return NextResponse.json({
        success: true,
        message: "Submission deleted successfully",
        id: submissionId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete submission",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Delete submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete submission",
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
