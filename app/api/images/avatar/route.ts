import { NextRequest, NextResponse } from "next/server"
import { multiDB } from "@/lib/database-api-service"

// API endpoint để lấy ảnh từ database thay vì từ file system
// Sử dụng: /api/images/avatar?userId=123&type=userID

export async function GET(request: NextRequest) {
    try {
        // Lấy thông số từ query params
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId") || ""
        // Sửa logic lấy type: nếu không có thì là "userID"
        const type = searchParams.get("type") ?? "userID"
        // Chuẩn hóa type cho đúng các giá trị
        if (!["userID"].includes(type))

            if (!userId) {
                return NextResponse.json(
                    { error: "Không đúng tên người dùng" },
                    { status: 400 }
                )
            }

        // Truy vấn bảng profile để lấy avatarUrl
        const profile = await multiDB.getUserAvatar(userId)
        // avatarUrl phải nằm trong tài khoản, không dùng userID làm avatarUrl
        // Sửa: DatabaseResult<string> nên dùng .data để lấy avatarUrl
        const avatarUrl = profile?.data

        if (!avatarUrl) {
            // Không có avatarUrl thì trả về ảnh mặc định
            return NextResponse.rewrite(new URL('/face.png', request.url))
        }

        // Nếu là link ngoài thì redirect, nếu là file local thì trả về trực tiếp
        if (avatarUrl.startsWith('http')) {
            return NextResponse.redirect(avatarUrl)
        }
        // Nếu là file local, trả về file
        return NextResponse.rewrite(new URL(avatarUrl, request.url))
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error("Lỗi tìm kiếm ảnh đại diện từ cơ sở dữ liệu:", error);
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}