import fs from "fs"
import path from "path"
function logToFile(message: string) {
    const logDir = path.resolve(process.cwd(), "logs")
    const logFile = path.join(logDir, "submission-api.log")
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`)
}
// Lựa chọn cách cho CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
import { type NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params
        const updateData = await request.json()

        const logMsg = `[PUT] 📝 Quá trình đăng tải các bản nhạc  ${submissionId} | Đang tải: ${JSON.stringify(updateData)}`
        console.log(logMsg)
        logToFile(logMsg)

        // Khi không hợp lệ
        if (!submissionId || Object.keys(updateData).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Các yêu cầu không hợp lệ",
                },
                { status: 400 }
            )
        }

        // Chỉ dữ liệu mới từ (primary database)
        const multiDBResult = await multiDB.updateSubmission(submissionId, updateData)

        if (multiDBResult.success) {
            return NextResponse.json({
                success: true,
                message: "Đã cập nhật thành công bản nhạc",
                data: multiDBResult.data
            })
        }

        // Nếu dữ liệu gọi thất bại, trả về lỗi
        return NextResponse.json(
            {
                success: false,
                message: multiDBResult.error || "Cập nhật thất bại",
            },
            { status: 500 }
        )
    } catch (error) {
        console.error("❌ Cập nhật bản nhạc lỗi:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Cập nhật thất bại do lỗi máy chủ",
            },
            { status: 500 }
        )
    }
}

// Gọi các bản nhạc theo ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params
        const { searchParams } = new URL(request.url)
        const includeTracks = searchParams.get("includeTracks") === "true"

        const logMsg = `[GET] 📋 Bắt đầu mục tiêu ${submissionId}${includeTracks ? ' với các bản nhạc' : ''} | Query params: ${JSON.stringify({ includeTracks })}`
        console.log(logMsg)
        logToFile(logMsg)

        // Chỉ định bản nhạc theo ID
        const multiDBResult = await multiDB.getSubmissionById(submissionId)

        if (multiDBResult?.success && multiDBResult.data) {
            let responseData = multiDBResult.data

            // Gọi các bản nhạc theo ID và theo dữ liệu
            if (includeTracks) {
                const tracksResult = await multiDB.getTracksBySubmissionId(submissionId)
                if (tracksResult.success && tracksResult.data) {
                    responseData = {
                        ...responseData,
                        tracks: tracksResult.data
                    }
                }
            }

            return NextResponse.json({
                success: true,
                data: responseData
            })
        }

        // Với dữ liệu không hợp lệ
        return NextResponse.json(
            {
                success: false,
                message: "Không tìm thấy bản nhạc",
            },
            { status: 404 }
        )
    } catch (error) {
        console.error("❌ Lỗi khi lấy bản nhạc:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Cập nhật thất bại do lỗi máy chủ",
            },
            { status: 500 }
        )
    }
}

// Xóa các bản nhạc
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params

        const logMsg = `[DELETE] 🗑️ Xóa bản nhạc ${submissionId}`
        console.log(logMsg)
        logToFile(logMsg)

        // Yêu cầu ID bản nhạc
        if (!submissionId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Thiếu ID bản nhạc",
                },
                { status: 400 }
            )
        }

        // Chỉ định dữ liệu cho (primary database)
        const multiDBResult = await multiDB.deleteSubmission(submissionId)

        if (multiDBResult?.success) {
            return NextResponse.json({
                success: true,
                message: "Submission deleted successfully from primary database"
            })
        }

        // Nếu dữ liệu gọi thất bại, trả về lỗi
        return NextResponse.json(
            {
                success: false,
                message: multiDBResult.error || "Xóa bản nhạc thất bại",
            },
            { status: 500 }
        )
    } catch (error) {
        console.error("❌ Lỗi khi xóa bản nhạc:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Xóa bản nhạc thất bại do lỗi máy chủ",
            },
            { status: 500 }
        )
    }
}