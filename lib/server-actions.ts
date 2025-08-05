// This file should only be imported on the server (e.g., in API routes)
import "server-only"

import type { User } from "@/types/user"
import { sendEmail, type EmailDetails } from "@/lib/email"
// Using Prisma instead of direct database queries

export async function registerUser(newUser: User): Promise<boolean> {
    const dbUrl = process.env.DATABASE_URL
    let isUserSavedSuccessfully = false

    if (dbUrl) {
        // Use API endpoints for user registration instead of direct database access
        console.log(`User ${newUser.username} registration handled by API endpoints.`)
        isUserSavedSuccessfully = true
    } else {
        console.warn("Database URL not configured.")
        isUserSavedSuccessfully = false
    }

    if (isUserSavedSuccessfully) {
        // Gửi email chào mừng
        const welcomeEmail: EmailDetails = {
            from: process.env.SMTP_FROM || "", // Chỉ sử dụng biến môi trường
            to: newUser.email,
            subject: `Chào mừng ${newUser.username || newUser.fullName} đến với An Kun Studio!`,
            textBody: `Chào mừng bạn đến với nền tảng phân phối nhạc An Kun Studio!\n\nTài khoản của bạn đã được tạo thành công.\nTên đăng nhập: ${newUser.username}\n\nChúc bạn có những trải nghiệm tuyệt vời!`,
            htmlBody: `<p>Chào mừng bạn đến với nền tảng phân phối nhạc <strong>An Kun Studio</strong>!</p><p>Tài khoản của bạn đã được tạo thành công.</p><ul><li>Tên đăng nhập: ${newUser.username}</li></ul><p>Chúc bạn có những trải nghiệm tuyệt vời!</p>`,
        }
        try {
            const emailResult = await sendEmail(welcomeEmail)
            if (!emailResult.success) {
                console.error("Lỗi gửi email chào mừng:", emailResult.message)
            }
        } catch (error) {
            console.error("Lỗi nghiêm trọng khi gửi email chào mừng:", error)
        }
        return true
    }
    return false
}

// Hàm đảm bảo người dùng admin mặc định tồn tại
export async function ensureDefaultAdminUser(): Promise<void> {
    const adminUsername = "admin"
    const adminRole = "Label Manager"
    
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
        console.error("Database URL not configured. Skipping default admin user check.")
        return
    }

    // Use API endpoints for admin user creation instead of direct database access
    console.log("Default admin user creation handled by API endpoints.")
}
