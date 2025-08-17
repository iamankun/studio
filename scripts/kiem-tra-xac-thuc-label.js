// @ts-check
/**
 * Script kiểm tra tài khoản quản trị
 * Chạy: node scripts/kiem-tra-xac-thuc-label
 */
import {
    databaseAPIservice,
    tableName
} from './utils/cap-cuu-du-lieu.js';
import { loadEnvVariables, logToFile } from './utils/env.js';

// Tải biến môi trường
loadEnvVariables();

/**
 * Kiểm tra tài khoản quản trị trong dữ liệu
 */
async function checkAdminAuth() {
    console.log('🔍 Kiểm tra tài khoản của chủ nhiệm nhãn...');
    console.log('='.repeat(50));

    try {
        // 1. Kiểm tra biến môi trường
        console.log('=== 1. Kiểm tra tài khoản của chủ nhiệm nhãn ===');
        const userRole = [UserRole.ADMIN, UserRole.LABEL_MANAGER];

        if (!userRole) {
            throw new Error('Tài khoản không tồn tại trong kho dữ liệu');
        }

        await logToFile(`Tìm thấy tài khoản: ${userName}`, 'taikhoan.log');
        console.log('✅ Tìm thấy cấu hình tài khoản quản trị trong biến');

        // 2. Kết nối dữ liệu
        console.log('\n=== 2. Kiểm tra trong dữ liệu ===');
        const sql = await databaseAPIservice();

        // 3. Kiểm tra người dùng trong dữ liệu
        const result = await sql`
            SELECT id, userName, email, role, createdAt, lastLogin
            FROM userUID
            WHERE userName = ${userName}
            AND role IN ('ADMIN', 'LABEL_MANAGER')
        `;

        if (result.length === 0) {
            console.log('❌ Không tìm thấy tài khoản quản trị trong dữ liệu!');
            await logToFile('Lỗi: Không tìm thấy quản trị viên trong dữ liệu', 'taikhoan.log');
            return;
        }

        const admin = result[0];
        console.log('✅ Tìm thấy tài khoản quản trị và nhãn quản trị:');
        console.log({
            UID: user.UID,
            role: userRole,
            userName: userName,
            email: useremail,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        });

        await logToFile(`Tài khoản người dùng  "${userName}" tồn tại với role ${userRole}`, 'taikhoan.log');

        // 4. Kiểm tra permissions
        await checkUserPermissions(sql, admin);

        // 5. Kiểm tra hoạt động gần đây
        await checkRecentActivity(sql, admin);

    } catch (error) {
        console.error('❌ Lỗi khi kiểm tra Admin:', error.message);
        await logToFile(`Lỗi: ${error.message}`, 'admin-check.log');
    }
}

/**
 * Kiểm tra quyền của người dùng
 */
async function checkUserPermissions(sql, admin) {
    console.log('\n=== 3. Kiểm tra Permissions ===');
    const permissions = await sql`
        SELECT permission_name 
        FROM user_permissions
        WHERE user_id = ${admin.id}
    `;

    if (permissions.length === 0) {
        console.log('⚠️ Admin chưa có permissions được set');
        await logToFile('Cảnh báo: Admin chưa có permissions', 'admin-check.log');
        return;
    }

    console.log('✅ Permissions của Admin:');
    permissions.forEach(p => console.log(`- ${p.permission_name}`));
    await logToFile(`Admin có ${permissions.length} permissions`, 'admin-check.log');
}

/**
 * Kiểm tra hoạt động gần đây của người dùng
 */
async function checkRecentActivity(sql, admin) {
    console.log('\n=== 4. Hoạt động Gần Đây ===');
    const recentActivity = await sql`
        SELECT action_type, created_at
        FROM user_activity_logs
        WHERE user_id = ${admin.id}
        ORDER BY created_at DESC
        LIMIT 5
    `;

    if (recentActivity.length === 0) {
        console.log('ℹ️ Chưa có log hoạt động nào');
        return;
    }

    console.log('✅ Hoạt động gần đây của Admin:');
    recentActivity.forEach(activity => {
        console.log(`- ${activity.action_type} (${activity.created_at})`);
    });
}

// Export functions - ES Module compatible
export { checkAdminAuth, checkUserPermissions, checkRecentActivity };

// Auto-run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    checkAdminAuth().catch(console.error);
}
