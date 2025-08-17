// @ts-check
/**
 * Utility để load biến môi trường và hỗ trợ các script trong thư mục scripts/
 * File: scripts/utils/env.js
 */
import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { mkdir, appendFile } from 'fs/promises';
import path from 'path';

/**
 * Tìm thư mục gốc dự án 
 * @param {string} startDir - Thư mục bắt đầu tìm kiếm
 * @returns {string} - Đường dẫn đến thư mục gốc dự án
 */
export function findProjectRoot(startDir) {
    // Bắt đầu từ thư mục hiện tại, đi lên tìm các file đặc trưng của dự án
    let currentDir = startDir;

    // Giới hạn số lần đi lên thư mục cha để tránh vòng lặp vô hạn
    let maxLevels = 5;
    let level = 0;

    while (level < maxLevels) {
        // Các file đặc trưng của dự án Next.js
        const projectFiles = ['package.json', 'next.config.js', '.env.local', '.env'];

        for (const file of projectFiles) {
            if (existsSync(path.join(currentDir, file))) {
                console.log(`🔍 Đã tìm thấy file dự án ${file} tại: ${currentDir}`);
                return currentDir;
            }
        }

        // Đi lên thư mục cha
        const parentDir = path.dirname(currentDir);

        // Nếu đã ở thư mục gốc, dừng tìm kiếm
        if (parentDir === currentDir) {
            break;
        }

        currentDir = parentDir;
        level++;
    }

    // Nếu không tìm thấy, trả về thư mục hiện tại
    console.log(`⚠️ Không tìm thấy thư mục gốc dự án, sử dụng: ${startDir}`);
    return startDir;
}

/**
* Tải thông tin biến môi trường từ nhiều vị trí tiềm năng
* @returns {boolean} - Trả về có nếu tìm thấy tệp biến môi trường hoặc dữ liệu
 */
export function loadEnvVariables() {
    // Định nghĩa các vị trí tìm kiếm
    const rootDir = process.cwd();
    const scriptDir = path.dirname(process.argv[1]);

    // Tìm thư mục gốc dự án bằng cách tìm các tệp đặc trưng
    const projectRoot = findProjectRoot(scriptDir);

    const locations = [
        // Từ thư mục gốc dự án đã tìm được
        path.join(projectRoot, '.env.local'),
        path.join(projectRoot, '.env'),
        // Từ thư mục hiện tại
        path.join(rootDir, '.env.local'),
        path.join(rootDir, '.env'),
        // Từ thư mục scripts
        path.join(scriptDir, '.env.local'),
        path.join(scriptDir, '.env'),
        // Đường dẫn tuyệt đối đến thư mục gốc dự án (cho trường hợp scripts được di chuyển)
        path.resolve(scriptDir, '..', '.env.local'),
        path.resolve(scriptDir, '..', '.env'),
    ];

    console.log('🔍 Tìm kiếm tệp biến...');
    console.log(`   Thư mục hiện tại: ${rootDir}`);
    console.log(`   Thư mục mã chạy js: ${scriptDir}`);
    console.log(`   Thư mục gốc dự án: ${projectRoot}`);

    // Kiểm tra các vị trí
    for (const loc of locations) {
        try {
            if (existsSync(loc)) {
                console.log(`✅ Đã tìm thấy tệp: ${loc}`);
                dotenv.config({ path: loc });
                return true;
            }
        } catch (error) {
            // Bỏ qua lỗi nhưng ghi nhật ký
            console.log(`   ⚠️ Lỗi khi kiểm tra ${loc}: ${error.message}`);
        }
    }

    // Thử tải tệp mặc định
    dotenv.config();

    // Kiểm tra xem có DATABASE_URL trong process.env không
    if (process.env.DATABASE_URL) {
        console.log('✅ Đã tìm thấy liên kết trong biến môi trường');
        return true;
    }

    // Thử đọc trực tiếp từ tệp .env.local nếu tồn tại
    const envLocalPath = path.join(projectRoot, '.env.local');
    if (existsSync(envLocalPath)) {
        try {
            console.log('📄 Đọc trực tiếp từ tệp biến...');
            const envContent = readFileSync(envLocalPath, 'utf8');
            const dbUrlMatch = envContent.match(/DATABASE_URL\s*=\s*["'](.+?)["']/);
            if (dbUrlMatch && dbUrlMatch[1]) {
                console.log('✅ Đã tìm thấy liên kết từ tệp .env.local');
                process.env.DATABASE_URL = dbUrlMatch[1];
                return true;
            }
        } catch (error) {
            console.error(`❌ Lỗi khi đọc tệp biến môi trường: ${error.message}`);
        }
    }

    console.log('❌ Không tìm thấy tệp biến môi trường hoặc biến môi trường');
    return false;
}

/**
 * Ghi nhật ký vào tệp
 * @param {string} message - Nội dung nhật ký
 * @param {string} [logFileName='script-log.log'] - Tên tệp nhật ký
 */
export async function logToFile(message, logFileName = 'script-log.log') {
    const timestamp = new Date().toISOString();
    const logDir = path.join(process.cwd(), "logs");
    await mkdir(logDir, { recursive: true });
    const logFile = path.join(logDir, logFileName);
    await appendFile(logFile, `[${timestamp}] ${message}\n`);
}

/**
 * Hàm lấy DATABASE_URL từ env hoặc fallback
 * @returns {string} DATABASE_URL
 */
export function getDatabaseUrl() {
    let DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error('Dữ liệu không có trong biến môi trường, cần kiểm tra lại tệp biến');
    }
    return DATABASE_URL;
}
