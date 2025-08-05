import { type NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const submissionId = params.id
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
    { params }: { params: { id: string } }
) {
    try {
        const submissionId = params.id

        console.log(`📋 Getting submission ${submissionId}`)

        // First try multiDB (primary database)
        const multiDBResult = await multiDB.getSubmissionById(submissionId)

        if (multiDBResult?.success && multiDBResult.data) {
            return NextResponse.json({
                success: true,
                data: multiDBResult.data
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
    { params }: { params: { id: string } }
) {
    try {
        const submissionId = params.id

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
                message: multiDBResult?.error || "Failed to delete submission",
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
