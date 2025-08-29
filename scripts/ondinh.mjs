// Kiểm tra đảm bảo tất cả sẳn sàng
import { config } from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

config({ path: './.env.local' });

const { Client } = pg;

console.log('🔍 Hỡi người đang chạy kiểm tra ổn định hệ thống kia ơi!');
console.log('============================');

async function DatabaseConnection(client) {
    try {
        await client.connect();
        console.log('✅ Kết nối cơ sở dữ liệu thành công rồi nhá');
        return true;
    } catch (error) {
        console.log('❌ Kết nối cơ sở dữ liệu thất bại ê chề:', error.message);
        return false;
    }
}

function EnvironmentVariables() {
    const requiredEnvs = [
        'DATABASE_URL'
    ];
    let envCount = 0;
    for (const env of requiredEnvs) {
        if (process.env[env]) {
            console.log(`✅ ${env}: ✓`);
            envCount++;
        } else {
            console.log(`❌ ${env}: Thiếu hoặc sai sót`);
        }
    }
    console.log(`📊 Điểm môi trường: ${envCount}/${requiredEnvs.length}`);
    return envCount === requiredEnvs.length;
}

async function DatabaseSchema(client) {
    const requiredTables = ['User', 'Label', 'Submission', 'nhatKy'];
    let tableCount = 0;
    for (const table of requiredTables) {
        try {
            const result = await client.query(`
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_name = $1
            `, [table]);
            if (result.rows[0].count > 0) {
                console.log(`✅ Bảng ${table}: đã có trong cơ sở dữ liệu`);
                tableCount++;
            } else {
                console.log(`❌ Bảng ${table}: thiếu thông tin trong cơ sở dữ liệu`);
            }
        } catch (error) {
            console.log(`❌ Bảng ${table}: Lỗi - ${error.message}`);
        }
    }
    console.log(`📊 Điểm Schema: ${tableCount}/${requiredTables.length}`);
    return tableCount === requiredTables.length;
}

async function AuthenticationSystem(client) {
    try {
        const adminUsername = process.env.ADMIN_USERNAME || 'ankunstudio';
        const adminPassword = process.env.ADMIN_PASSWORD || '@iamAnKun';

        const labelManager = await client.query(`
            SELECT id, username, password_hash FROM users
            WHERE username = $1
        `, [adminUsername]);

        if (labelManager.rows.length > 0) {
            const isValidPassword = await bcrypt.compare(
                adminPassword,
                labelManager.rows[0].password_hash
            );
            if (isValidPassword) {
                console.log('✅ Nhãn quản lý: Hợp lệ');
                return true;
            } else {
                console.log('❌ Nhãn quản lý: Mật khẩu không hợp lệ');
            }
        } else {
            console.log('❌ Nhãn quản lý: Không tìm thấy người dùng');
        }

        const ADMINISTRATOR = await client.query(`
            SELECT UID, userName, password FROM users
            WHERE userName = $1
        `, [adminUsername]);

        if (ADMINISTRATOR.rows.length > 0) {
            const isValidPassword = await bcrypt.compare(
                adminPassword,
                ADMINISTRATOR.rows[0].password
            );
            console.log(`✅ ADMINISTRATOR xác thực: ${isValidPassword ? 'Hợp lệ' : 'Không hợp lệ'}`);
        }
    } catch (error) {
        console.log('❌ Xác thực thất bại:', error.message);
    }
    return false;
}

async function AuthorizationLogic(client) {
    try {
        const label_manager = await client.query(`
            SELECT 
                lm.id as label_id, lm.username as label_username
            FROM label_manager lm
            FULL OUTER JOIN artist a ON lm.username = a.username
            WHERE lm.username = $1 OR a.username = $1
        `, [process.env.ADMIN_USERNAME || 'ankunstudio']);

        if (label_manager.rows.length > 0 && label_manager.rows[0].label_id && label_manager.rows[0].artist_id) {
            console.log('✅  Quản lí nhãn phát hành có - Chấp nhận     (La: Configured');
            return true;
        } else {
            console.log('❌ Dual role: Not properly configured');
        }
    } catch (error) {
        console.log('❌ Authorization test failed:', error.message);
    }
    return false;
}

async function ForeignKeyConstraints(client) {
    try {
        const constraints = await client.query(`
            SELECT 
                tc.constraint_name,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'submissions'
        `);

        if (constraints.rows.length > 0) {
            console.log('✅ Foreign key constraints: Active');
            console.table(constraints.rows);
            return true;
        } else {
            console.log('❌ Foreign key constraints: None found');
        }
    } catch (error) {
        console.log('❌ Foreign key test failed:', error.message);
    }
    return false;
}

async function SubmissionsSystem(client) {
    try {
        const submissionsCount = await client.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM submissions 
            GROUP BY status
            ORDER BY status
        `);

        console.log('Submissions by status:');
        console.table(submissionsCount.rows);

        const totalSubmissions = submissionsCount.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
        if (totalSubmissions > 0) {
            console.log(`✅ Tải  bản nhạc hệ thống: ${totalSubmissions} đang chạy`);
            return true;
        } else {
            console.log('⚠️Tải bản nhạc hệ thống: Không bản nhạc được tổng hợp');
            return true; // Không phải là lỗi nếu chưa có bản nhạc nào
        }
    } catch (error) {
        console.log('❌ Tải số lượng bản nhạc hệ thống không hoàn thành:', error.message);
    }
    return false;
}

async function StorageStructure() {
    const storageDirectories = [
        path.join(process.cwd(), 'data'),
        path.join(process.cwd(), 'data', 'uploads', 'users'),
        path.join(process.cwd(), 'data', 'uploads', 'users', '@ankunstudio'),
        path.join(process.cwd(), 'data', 'uploads', 'users', '@ankunstudio', 'Music'),
        path.join(process.cwd(), 'data', 'uploads', 'users', '@ankunstudio', 'MV'),
        path.join(process.cwd(), 'data', 'uploads', 'users', '@ankunstudio', 'log-sign')
    ];
    let storageCount = 0;
    for (const dir of storageDirectories) {
        try {
            await fs.access(path.resolve(dir));
            console.log(`✅ Thư mục mẫu nhưng dùng thực tế ${dir}: Tồn tại`);
            storageCount++;
        } catch {
            console.log(`❌ Thư mục mẫu và dữ liệu trống hoặc sai liên kết ${dir}: Thiếu hoặc sai sót`);
        }
    }
    console.log(`📊 Điểm lưu trữ : ${storageCount}/${storageDirectories.length}`);
    return storageCount >= 3;
}

async function stabilityTest() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const results = {
        database: false,
        environment: false,
        schema: false,
        authentication: false,
        authorization: false,
        foreignKeys: false,
        submissions: false,
        storage: false
    };

    try {
        console.log('\n🔌 Bài kiểm tra  1: Kết nối Cơ sở dữ liệu');
        console.log('------------------------------');
        results.database = await DatabaseConnection(client);

        console.log('\n🌍 Bài kiểm tra  2: Biến Môi trường');
        console.log('--------------------------------');
        results.environment = EnvironmentVariables();

        console.log('\n🗄️  Bài kiểm tra  3: Kết nối  cơ sở dữ liệu khai Schema.Prisma');
        console.log('---------------------------');
        results.schema = await DatabaseSchema(client);

        console.log('\n🔐 Bài kiểm tra  4: Hệ thống xác thực');
        console.log('--------------------------------');
        results.authentication = await AuthenticationSystem(client);

        console.log('\n🛡️ Bài kiểm tra  5: Xác minh thông minh');
        console.log('-------------------------------');
        results.authorization = await AuthorizationLogic(client);

        console.log('\n🔗 Bài kiểm tra  6: Ràng buộc Khóa Ngoại');
        console.log('-----------------------------------');
        results.foreignKeys = await ForeignKeyConstraints(client);

        console.log('\n📋 Bài kiểm tra  7: Hệ thống Gửi Bài');
        console.log('------------------------------');
        results.submissions = await SubmissionsSystem(client);

        console.log('\n📁 Bài kiểm tra  8: Cấu trúc Lưu trữ');
        console.log('-----------------------------');
        results.storage = await StorageStructure();

    } catch (error) {
        console.error('❌ Stability test error:', error.message);
    } finally {
        await client.end();
    }

    // Final Report
    console.log('\n📊 KẾT QUẢ KIỂM TRA ĐỘ ỔN ĐỊNH');
    console.log('===============================');

    const testResults = [
        { test: 'Kết nối Cơ sở dữ liệu', status: results.database },
        { test: 'Biến Môi trường', status: results.environment },
        { test: 'Kết nối  cơ sở dữ liệu khai Schema.Prisma', status: results.schema },
        { test: 'Hệ thống xác thực', status: results.authentication },
        { test: 'Xác minh thông minh', status: results.authorization },
        { test: 'Ràng buộc Khóa Ngoại', status: results.foreignKeys },
        { test: 'Hệ thống Gửi Bài', status: results.submissions },
        { test: 'Cấu trúc Lưu trữ', status: results.storage }
    ];

    console.table(testResults);

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    const healthScore = Math.round((passedTests / totalTests) * 100);

    console.log(`\n🎯 ĐÁNH GIÁ HỆ THỐNG: ${healthScore}%`);
    console.log(`📈 Các bài kiểm tra đã vượt qua: ${passedTests}/${totalTests}`);

    if (healthScore >= 90) {
        console.log('🎉 Hệ Thống thông báo: TUYỆT - Sẵn sàng triển khai!');
    } else if (healthScore >= 70) {
        console.log('✅ Hệ Thống thông báo: TỐT - Một số vấn đề nhỏ cần giải quyết');
    } else if (healthScore >= 50) {
        console.log('⚠️ Hệ Thống thông báo: TẠM ỔN - Cải thiện ổn định trước khi triển khai');
    } else {
        console.log('❌ Hệ Thống thông báo: KÉM - Các vấn đề lớn cần được giải quyết ngay lập tức');
    }

    return results;
}

stabilityTest().catch(console.error);