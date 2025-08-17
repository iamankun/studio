import { NextRequest, NextResponse } from "next/server";
import { multiDB } from "@/lib/database-api-service";
// Using Prisma instead of direct neon queries

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, username, email, fullName, bio, avatar, socialLinks, role } = data;

        if (!id || !username || !role) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Thiếu thông tin: id, username, và role là bắt buộc"
                },
                { status: 400 }
            );
        }

        // Kết nối trực tiếp đến DB
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Không tìm thấy cấu hình database"
                },
                { status: 500 }
            );
        }

        // Use multiDB service for database operations
        try {
            const updateResult = await multiDB.updateArtistProfile(username, {
                email,
                fullName,
                bio,
                avatar,
                socialLinks
            });

            if (updateResult.success && updateResult.data) {
                return NextResponse.json({
                    success: true,
                    message: "Cập nhật profile thành công",
                    user: updateResult.data
                });
            } else {
                return NextResponse.json(
                    {
                        success: false,
                        message: updateResult.message || "Không tìm thấy người dùng để cập nhật"
                    },
                    { status: 404 }
                );
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
                {
                    success: false,
                    message: `Lỗi database: ${dbError instanceof Error ? dbError.message : "Unknown error"}`
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            {
                success: false,
                message: `Lỗi cập nhật profile: ${error instanceof Error ? error.message : "Unknown error"}`
            },
            { status: 500 }
        );
    }
}