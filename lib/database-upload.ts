import sharp from "sharp";
import { multiDB } from "./database-api-service";

type UploadResult = {
    success: boolean;
    url?: string;
    key?: string;
    error?: string;
};

// Upload avatar vào cơ sở dữ liệu PostgreSQL
export async function uploadAvatarToDatabase(file: File, userId: string): Promise<UploadResult> {
    try {
        // Đọc và xử lý file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Lấy định dạng MIME của file gốc hoặc mặc định là image/jpeg
        const mimeType = file.type || "image/jpeg";
        console.log(`Uploading file type: ${mimeType}`);

        // Resize ảnh thành 300x300
        let processedBuffer: Buffer;
        try {
            processedBuffer = await sharp(buffer)
                .resize(300, 300, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                })
                .jpeg({ quality: 80 })
                .toBuffer();
        } catch (resizeError) {
            console.error("Điều chỉnh kích thước ảnh thất bại:", resizeError);
            processedBuffer = buffer; // Sử dụng ảnh gốc nếu resize thất bại
        }

        // Tạo File object từ buffer để phù hợp với API
        const uint8Array = new Uint8Array(processedBuffer);
        const avatarFile = new File([uint8Array], `avatar-${userId}.jpg`, {
            type: mimeType
        });

        // Lưu avatar vào bảng Profile của user
        const result = await multiDB.updateUserAvatar(userId, {
            file: avatarFile,
            artistName: userId // hoặc truyền tên nghệ sĩ thực tế nếu có biến khác
        });
        return result;
    } catch (error) {
        console.error("Database avatar upload error:", error);
        return {
            success: false,
            error: `Lỗi lưu vào database: ${(error as Error).message}`
        };
    }
}
