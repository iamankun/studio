// Database Connection Test - Multi-Database Service Architecture
/**
 * Script để kiểm tra kết nối database qua Multi-Database Service API
 * Chạy bằng lệnh: node scripts/kiem-tra-ket-noi-database.mjs
 */

import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cấu hình đường dẫn chính xác cho dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function checkDatabaseStatusAPI(baseUrl) {
    console.log('\n3. Kiểm tra Database Status API');
    try {
        const statusResponse = await fetch(`${baseUrl}/api/database-status`);
        if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            console.log('✅ Database Status API hoạt động');
            console.log(`   Status: ${statusData.status || 'Unknown'}`);
            console.log(`   Provider: ${statusData.provider || 'Unknown'}`);
            console.log(`   Connection: ${statusData.connected ? 'Connected' : 'Disconnected'}`);
        } else {
            console.log('⚠️ Database Status API không khả dụng');
        }
    } catch (error) {
        console.log('⚠️ Database Status API không thể truy cập:', error.message);
    }
}

async function checkSubmissionsAPI(baseUrl) {
    console.log('\n4. Kiểm tra Submissions API (Database qua API)');
    try {
        const submissionsResponse = await fetch(`${baseUrl}/api/submissions`);
        if (submissionsResponse.ok) {
            const submissionsData = await submissionsResponse.json();
            console.log('✅ Submissions API hoạt động');
            console.log(`   Success: ${submissionsData.success}`);
            console.log(`   Data count: ${submissionsData.data?.length || 0}`);
            if (submissionsData.data && submissionsData.data.length > 0) {
                console.log(`   Sample submission: "${submissionsData.data[0].title}" by ${submissionsData.data[0].artist}`);
            }
        } else {
            console.log('❌ Submissions API lỗi:', submissionsResponse.status);
        }
    } catch (error) {
        console.log('❌ Submissions API không thể truy cập:', error.message);
    }
}

async function checkUsersAPI(baseUrl) {
    console.log('\n5. Kiểm tra Users API');
    try {
        const usersResponse = await fetch(`${baseUrl}/api/users`);
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('✅ Users API hoạt động');
            console.log(`   Success: ${usersData.success}`);
            console.log(`   Users count: ${usersData.data?.length || 0}`);
        } else {
            console.log('❌ Users API lỗi:', usersResponse.status);
        }
    } catch (error) {
        console.log('❌ Users API không thể truy cập:', error.message);
    }
}

async function checkActivityLogAPI(baseUrl) {
    console.log('\n6. Kiểm tra Activity Log API');
    try {
        const logResponse = await fetch(`${baseUrl}/api/activity-log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'database_connection_test',
                details: { timestamp: new Date().toISOString() }
            })
        });
        if (logResponse.ok) {
            const logData = await logResponse.json();
            console.log('✅ Activity Log API hoạt động');
            console.log(`   Success: ${logData.success}`);
            console.log(`   Mode: ${logData.mode || 'database'}`);
        } else {
            console.log('❌ Activity Log API lỗi:', logResponse.status);
        }
    } catch (error) {
        console.log('❌ Activity Log API không thể truy cập:', error.message);
    }
}

function printSystemArchitecture() {
    console.log('\n7. Tóm tắt kiến trúc hệ thống');
    console.log('📋 Kiến trúc Multi-Database Service:');
    console.log('   Client → API Routes → Multi-Database Service → Database');
    console.log('   - API Layer: Xử lý authentication, validation, business logic');
    console.log('   - Multi-DB Service: Hỗ trợ nhiều database providers');
    console.log('   - Database: PostgreSQL/MySQL qua DATABASE_URL');
    console.log('   - Fallback: LocalStorage cho offline mode');
}

function handleConnectionError(connectionError) {
    console.error('❌ Lỗi kết nối tổng thể:', connectionError.message);
    if (connectionError.message.includes('ENOTFOUND')) {
        console.log('→ Không tìm thấy server. Kiểm tra lại NEXT_PUBLIC_API_URL');
    } else if (connectionError.message.includes('ECONNREFUSED')) {
        console.log('→ Server từ chối kết nối. Kiểm tra Next.js server đã chạy chưa');
    } else if (connectionError.message.includes('fetch')) {
        console.log('→ Lỗi fetch API. Kiểm tra server và network connection');
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('- Chạy Next.js server: npm run dev');
    console.log('- Kiểm tra DATABASE_URL trong .env.local');
    console.log('- Kiểm tra NEXT_PUBLIC_API_URL');
    console.log('- Kiểm tra Multi-Database Service configuration');
}

async function debugDatabaseConnection() {
    console.log('=== Bắt đầu kiểm tra Multi-Database Service ===');
    console.log('1. Kiểm tra biến môi trường DATABASE_URL');

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('❌ Lỗi: DATABASE_URL không tìm thấy trong .env.local');
        console.log('Vui lòng kiểm tra file .env.local và đảm bảo có biến DATABASE_URL');
        return;
    }

    console.log('✅ Tìm thấy DATABASE_URL');
    console.log(`DATABASE_URL bắt đầu với: ${DATABASE_URL.substring(0, 20)}...`);

    console.log('\n2. Kiểm tra API endpoints');

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    console.log(`🌐 API Base URL: ${baseUrl}`);

    try {
        await checkDatabaseStatusAPI(baseUrl);
        await checkSubmissionsAPI(baseUrl);
        await checkUsersAPI(baseUrl);
        await checkActivityLogAPI(baseUrl);
        printSystemArchitecture();
    } catch (connectionError) {
        handleConnectionError(connectionError);
    }

    console.log('\n=== Kết thúc kiểm tra ===');
}

// Chạy hàm debug
debugDatabaseConnection()
    .then(async () => {
        console.log('\n✅ Script kiểm tra hoàn tất.');
        console.log('💡 Lưu ý: Hệ thống sử dụng Multi-Database Service API');
        console.log('   Không truy cập trực tiếp database mà qua API layer');
    })
    .catch(async (err) => {
        console.error('❌ Script gặp lỗi không mong muốn:', err.message);
        process.exit(1);
    });