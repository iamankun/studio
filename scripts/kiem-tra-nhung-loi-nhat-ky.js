// @ts-check
/**
 * Script kiểm tra lỗi và vấn đề trong bảng nhat_ky_studio
 * Phát hiện các bản ghi không hợp lệ hoặc có vấn đề
 */

import { neon } from "@neondatabase/serverless";
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function logToFile(message) {
    try {
        const logDir = path.join((/** @type {any} */ (process)).cwd(), "logs");
        await fs.mkdir(logDir, { recursive: true });
        const logFile = path.join(logDir, "kiem-tra-loi-nhat-ky.log");
        const timestamp = new Date().toISOString();
        await fs.appendFile(logFile, `[${timestamp}] ${message}\n`);
    } catch (e) {
        console.error("Failed to write to log file:", e);
    }
}

async function connectToDatabase() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error('DATABASE_URL không tìm thấy trong .env.local');
    }
    return neon(DATABASE_URL);
}

async function kiemTraLoiNhatKy() {
    console.log('🔍 Kiểm tra lỗi trong bảng nhat_ky_studio');
    console.log('='.repeat(70));
    await logToFile('Bắt đầu kiểm tra lỗi nhat_ky_studio');

    try {
        // Kết nối đến database
        console.log('=== 1. Kết nối đến database ===');
        const sql = await connectToDatabase();
        await logToFile('Kết nối database thành công');

        // Kiểm tra bảng tồn tại
        console.log('\n=== 2. Kiểm tra bảng nhat_ky_studio ===');
        const existingTable = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'nhat_ky_studio'
        `;

        if (existingTable.length === 0) {
            console.error('❌ Bảng nhat_ky_studio không tồn tại');
            await logToFile('❌ Bảng nhat_ky_studio không tồn tại');
            console.log('Vui lòng chạy script tao-bang-nhat-ky.js trước');
            return;
        }

        console.log('✅ Bảng nhat_ky_studio tồn tại');
        await logToFile('✅ Bảng nhat_ky_studio tồn tại');

        // Kiểm tra dữ liệu trống hoặc null
        console.log('\n=== 3. Kiểm tra dữ liệu trống ===');

        // Kiểm tra username trống
        const nullUsername = await sql`
            SELECT COUNT(*) as count FROM nhat_ky_studio
            WHERE username IS NULL OR TRIM(username) = ''
        `;

        console.log(`Username trống: ${nullUsername[0].count} bản ghi`);
        if (nullUsername[0].count > 0) {
            console.log('⚠️ Có bản ghi thiếu username');
            await logToFile(`⚠️ Phát hiện ${nullUsername[0].count} bản ghi thiếu username`);
        }

        // Kiểm tra action trống
        const nullAction = await sql`
            SELECT COUNT(*) as count FROM nhat_ky_studio
            WHERE action IS NULL OR TRIM(action) = ''
        `;

        console.log(`Action trống: ${nullAction[0].count} bản ghi`);
        if (nullAction[0].count > 0) {
            console.log('⚠️ Có bản ghi thiếu action');
            await logToFile(`⚠️ Phát hiện ${nullAction[0].count} bản ghi thiếu action`);
        }

        // Kiểm tra category trống
        const nullCategory = await sql`
            SELECT COUNT(*) as count FROM nhat_ky_studio
            WHERE category IS NULL OR TRIM(category) = ''
        `;

        console.log(`Category trống: ${nullCategory[0].count} bản ghi`);
        if (nullCategory[