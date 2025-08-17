import { type NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params
        const updateData = await request.json()

        console.log(`📝 Updating submission ${submissionId}`)

        // Validate required fields
        if (!submissionId || Object.keys(updateData).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 }
            )
        }

        // First try to update using multiDB (primary database)
        const multiDBResult = await multiDB.updateSubmission(submissionId, updateData)

        if (multiDBResult.success) {
            return NextResponse.json({
                success: true,
                message: "Submission updated successfully in primary database",
                data: multiDBResult.data
            })
        }

        // If multiDB fails, return error
        return NextResponse.json(
            {
                success: false,
                message: multiDBResult.error || "Failed to update submission",
            },
            { status: 500 }
        )
    } catch (error) {
        console.error("❌ Update submission error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update submission due to server error",
            },
            { status: 500 }
        )
    }
}

// Get a specific submission by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params
        const { searchParams } = new URL(request.url)
        const includeTracks = searchParams.get("includeTracks") === "true"

        console.log(`📋 Getting submission ${submissionId}${includeTracks ? ' with tracks' : ''}`)

        // First try multiDB (primary database)
        const multiDBResult = await multiDB.getSubmissionById(submissionId)

        if (multiDBResult?.success && multiDBResult.data) {
            let responseData = multiDBResult.data

            // If includeTracks is requested, fetch tracks for this submission
            if (includeTracks) {
                const tracksResult = await multiDB.getTracksBySubmissionId(submissionId)
                if (tracksResult.success && tracksResult.data) {
                    responseData = {
                        ...responseData,
                        tracks: tracksResult.data
                    } as any // Type assertion to allow tracks property
                }
            }

            return NextResponse.json({
                success: true,
                data: responseData
            })
        }

        // If multiDB fails, return error
        return NextResponse.json(
            {
                success: false,
                message: "Submission not found",
            },
            { status: 404 }
        )
    } catch (error) {
        console.error("❌ Get submission error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve submission due to server error",
            },
            { status: 500 }
        )
    }
}

// Delete a submission
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params

        console.log(`🗑️ Deleting submission ${submissionId}`)

        // Validate required field
        if (!submissionId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing submission ID",
                },
                { status: 400 }
            )
        }

        // First try multiDB (primary database)
        const multiDBResult = await multiDB.deleteSubmission(submissionId)

        if (multiDBResult?.success) {
            return NextResponse.json({
                success: true,
                message: "Submission deleted successfully from primary database"
            })
        }

        // If multiDB fails, return error
        return NextResponse.json(
            {
                success: false,
                message: multiDBResult.error || "Failed to delete submission",
            },
            { status: 500 }
        )
    } catch (error) {
        console.error("❌ Delete submission error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete submission due to server error",
            },
            { status: 500 }
        )
    }
}