// @ts-check
/**
 * Script để quản lý và xem log hoạt động trong bảng nhat_ky_studio
 * Dùng để truy vấn, tìm kiếm và xuất báo cáo từ bảng log
 */

import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import postgres from 'postgres';

// Tải biến môi trường
dotenv.config({ path: '.env.local' });

async function logToFile(message) {
    try {
        const logDir = path.join(process.cwd(), "Nhật ký");
        await fs.mkdir(logDir, { recursive: true });
        const logFile = path.join(logDir, "xemnhatKy.log");
        const timestamp = new Date().toISOString();
        await fs.appendFile(logFile, `[${timestamp}] ${message}\n`);
    } catch (e) {
        console.error("Lỗi khi viết vào tệp nhật ký:", e);
    }
}

async function databaseAPIservice() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error('Biến không tìm thấy trong biến môi trường');
    }
    // Khởi tạo client postgres
    return postgres(DATABASE_URL, { ssl: 'require' });
}

/**
 * Truy vấn logs theo các tiêu chí
 * @param {Object} options - Các tùy chọn truy vấn
 * @param {number} [options.limit=50] - Số lượng kết quả tối đa
 * @param {string} [options.userUID] - Lọc theo userUID
 * @param {string} [options.userName] - Lọc theo userName
 * @param {string} [options.action] - Lọc theo action
 * @param {string} [options.category] - Lọc theo category
 * @param {string} [options.status] - Lọc theo status
 * @param {string} [options.componentName] - Lọc theo component_name
 * @param {string} [options.startDate] - Lọc từ ngày (YYYY-MM-DD)
 * @param {string} [options.endDate] - Lọc đến ngày (YYYY-MM-DD)
 * @param {string} [options.sortBy='createdAt'] - Sắp xếp theo trường
 * @param {string} [options.sortOrder='DESC'] - Thứ tự sắp xếp (ASC/DESC)
 * @returns {Promise<Array>} - Danh sách logs
 */
async function queryLogs(options = {}) {
    const {
        limit = 50,
        userName,
        action,
        startDate,
        endDate,
        sortOrder = 'DESC'
    } = options;

    try {
        const sql = await databaseAPIservice();

        // Bắt đầu câu truy vấn
        let query = sql`SELECT n.*, u.userName, u.email, u.roles FROM "nhatKy" n LEFT JOIN "User" u ON n.userName = u.userName WHERE 1=1`;

        // Thêm các điều kiện lọc

        if (userName) {
            query = sql`${query} AND n.userName = ${userName}`;
        }
        if (action) {
            query = sql`${query} AND n.action = ${action}`;
        }
        if (startDate) {
            query = sql`${query} AND n.createdAt >= ${startDate}`;
        }
        if (endDate) {
            query = sql`${query} AND n.createdAt <= ${endDate}`;
        }

        // Thêm sắp xếp và giới hạn
        if (sortOrder === 'ASC') {
            query = sql`${query} ORDER BY n.createdAt ASC LIMIT ${limit}`;
        } else {
            query = sql`${query} ORDER BY n.createdAt DESC LIMIT ${limit}`;
        }

        // Thực hiện truy vấn
        return await query;
    } catch (error) {
        console.error('Lỗi khi truy vấn nhật ký:', error);
        throw error;
    }
}

/**
 * Lấy thống kê từ nhật ký
 * @returns {Promise<Object>} - Các thống kê
 */
async function getLogStats() {
    try {
        const sql = await databaseAPIservice();

        // Tổng số nhật ký
        const totalLogs = await sql`SELECT COUNT(*) as count FROM "nhatKy"`;

        // Thống kê theo hành động
        const actionStats = await sql`
            SELECT action, COUNT(*) as count
            FROM "nhatKy"
            GROUP BY action
            ORDER BY count DESC
        `;

        // Thống kê theo tài khoản
        const userStats = await sql`
            SELECT userName, COUNT(*) as count
            FROM "nhatKy"
            GROUP BY userName
            ORDER BY count DESC
            LIMIT 10
        `;

        // Thống kê theo nhóm
        const categoryStats = await sql`
            SELECT category, COUNT(*) as count
            FROM nhatKy
            GROUP BY category
            ORDER BY count DESC
        `;

        // Thống kê theo ngày (7 ngày gần nhất)
        const dateStats = await sql`
            SELECT DATE_TRUNC('day', createdAt) as date, COUNT(*) as count
            FROM "nhatKy"
            WHERE createdAt >= NOW() - INTERVAL '7 ngày'
            GROUP BY date
            ORDER BY date DESC
        `;

        // Thống kê theo trạng thái
        const statusStats = await sql`
            SELECT status, COUNT(*) as count
            FROM nhatKy
            GROUP BY status
            ORDER BY count DESC
        `;

        // Thống kê theo gói
        const componentStats = await sql`
            SELECT component_name, COUNT(*) as count
            FROM nhatKy
            GROUP BY component_name
            ORDER BY count DESC
            LIMIT 10
        `;

        return {
            total: totalLogs[0].count,
            byAction: actionStats,
            byUser: userStats,
            byCategory: categoryStats,
            byDate: dateStats,
            byStatus: statusStats,
            byComponent: componentStats
        };
    } catch (error) {
        console.error('Lỗi khi lấy thống kê nhật ký:', error);
        throw error;
    }
}

/**
 * Xuất logs ra file CSV
 * @param {Array} logs - Danh sách logs
 * @param {string} [filename] - Tên file xuất
 * @returns {Promise<string>} - Đường dẫn đến file đã xuất
 */
async function exportLogsToCSV(logs, filename) {
    try {
        // Tạo thư mục exports nếu chưa tồn tại
        const exportDir = path.join(process.cwd(), "nhatky");
        await fs.mkdir(exportDir, { recursive: true });

        // Tạo tên file
        const defaultFilename = `nhatKy-${new Date().toISOString().replace(/:/g, '-')}.csv`;
        const csvFilePath = path.join(exportDir, filename ?? defaultFilename);

        // Tạo header CSV
        const headers = [
            'id', 'action', 'details', 'userName', 'email', 'roles', 'createdAt'
        ];
        let csvContent = headers.join(',') + '\n';
        for (const log of logs) {
            const row = [
                log.id,
                `"${(log.action || '').replace(/"/g, '""')}"`,
                `"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`,
                `"${(log.userName || '').replace(/"/g, '""')}"`,
                `"${(log.email || '').replace(/"/g, '""')}"`,
                `"${JSON.stringify(log.roles || []).replace(/"/g, '""')}"`,
                log.createdAt ? new Date(log.createdAt).toISOString() : ''
            ];
            csvContent += row.join(',') + '\n';
        }

        // Ghi file
        await fs.writeFile(csvFilePath, csvContent, 'utf8');

        return csvFilePath;
    } catch (error) {
        console.error('Lỗi khi xuất logs ra CSV:', error);
        throw error;
    }
}

/**
 * Xóa logs cũ
 * @param {number} days - Số ngày (logs cũ hơn số ngày này sẽ bị xóa)
 * @returns {Promise<number>} - Số lượng logs đã xóa
 */
async function deleteOldLogs(days) {
    try {
        const sql = await databaseAPIservice();

        // Xóa nhật ký cũ
        const result = await sql`
            DELETE FROM nhatKy
            WHERE createdAt < NOW() - INTERVAL '${days} ngày'
            RETURNING id
        `;

        return result.length;
    } catch (error) {
        console.error('Lỗi khi xóa nhật ký cũ:', error);
        throw error;
    }
}

// Helper: parse arguments for 'danh sach'
function parseDanhSachArgs(args) {
    let limit = 50, userName, action;
    if (args[1] && !args[1].startsWith('--')) limit = parseInt(args[1], 10) ?? 50;
    for (const arg of args) {
        if (arg.startsWith('--userName=')) userName = arg.substring(11);
        else if (arg.startsWith('--action=')) action = arg.substring(9);
    }
    return { limit, userName, action };
}

// Handler: 'danh sach'
async function handleDanhSach(args) {
    const opts = parseDanhSachArgs(args);
    console.log(`=== DANH SÁCH LOG (tối đa ${opts.limit}) ===`);
    if (opts.userName) console.log(`Lọc theo tài khoản: ${opts.userName}`);
    if (opts.action) console.log(`Lọc theo hành động: ${opts.action}`);
    const logs = await queryLogs(opts);
    console.log(`\nĐã tìm thấy ${logs.length} nhật ký:`);
    for (const log of logs) {
        console.log('-'.repeat(80));
        console.log(`ID: ${log.id} | Thời gian: ${log.createdAt}`);
        console.log(`User: ${log.userName ?? 'N/A'}`);
        console.log(`Action: ${log.action ?? 'N/A'}`);
        console.log(`Details: ${JSON.stringify(log.details ?? {})}`);
    }
}

// Handler: 'thongke'
async function handleThongKe() {
    console.log('=== THỐNG KÊ NHẬT KÝ STUDIO ===');
    const stats = await getLogStats();
    console.log(`\nTổng số nhật ký: ${stats.total}`);
    console.log('\n=== THỐNG KÊ THEO LOẠI HÀNH ĐỘNG ===');
    stats.byAction.forEach(item => console.log(`- ${item.action}: ${item.count} nhật ký`));
    console.log('\n=== THỐNG KÊ THEO DANH MỤC ===');
    stats.byCategory.forEach(item => console.log(`- ${item.category}: ${item.count} nhật ký`));
    console.log('\n=== THỐNG KÊ THEO NGƯỜI DÙNG ===');
    stats.byUser.forEach(item => {
        // Log giá trị thực tế để debug
        console.log('DEBUG item:', item);
        console.log(`- ${item.userName || 'Không xác định'}: ${item.count} nhật ký`);
    });
    console.log('\n=== THỐNG KÊ THEO COMPONENT ===');
    stats.byComponent.forEach(item => console.log(`- ${item.component_name || 'Không xác định'}: ${item.count} nhật ký`));
    console.log('\n=== THỐNG KÊ THEO NGÀY (7 NGÀY GẦN NHẤT) ===');
    stats.byDate.forEach(item => {
        const date = new Date(item.date).toISOString().split('T')[0];
        console.log(`- ${date}: ${item.count} log`);
    });
    console.log('\n=== THỐNG KÊ THEO TRẠNG THÁI ===');
    stats.byStatus.forEach(item => console.log(`- ${item.status ?? 'N/A'}: ${item.count} nhật ký`));
}

// Handler: 'xuat'
async function handleXuat(args) {
    let filename = args[1], limit = 1000;
    for (const arg of args) {
        if (arg.startsWith('--limit=')) limit = parseInt(arg.substring(8), 10) || 1000;
    }
    console.log(`=== XUẤT NHẬT KÝ (tối đa ${limit}) ===`);
    const logs = await queryLogs({ limit });
    const csvPath = await exportLogsToCSV(logs, filename);
    console.log(`\nĐã xuất ${logs.length} nhật ký ra tệp:`);
    console.log(csvPath);
}

// Handler: 'xoa'
async function handleXoa(args) {
    const days = parseInt(args[1], 10) ?? 30;
    console.log(`=== XÓA NHẬT KÝ CŨ (> ${days} ngày) ===`);
    console.log('\nCảnh báo: Hành động này không thể hoàn tác!');
    console.log('Hệ thống sẽ xóa nhật ký cũ hơn ' + days + ' ngày.');
    const deletedCount = await deleteOldLogs(days);
    console.log(`\nĐã xóa ${deletedCount} nhật ký cũ.`);
}

// Handler: 'cuu' or help
function handleHelp() {
    console.log('=== QUẢN LÝ NHẬT KÝ STUDIO ===');
    console.log('Sử dụng: node xemnhatKy.js [lệnh] [tham số]');
    console.log('\nCác lệnh:');
    console.log('danh sach [limit] [--user=X] [--userUID=X] [--action=X] [--category=X] [--status=X] [--component=X] - Liệt kê nhật ký');
    console.log('thong ke                                                     - Hiển thị thống kê');
    console.log('xuat [filename] [--limit=X]                                 - Xuất ra tệp CSV');
    console.log('xoa [days]                                                  - Xóa nhật ký cũ');
    console.log('cuu                                                          - Hiển thị trợ giúp');
}

// Main function refactored
async function main() {
    try {
        const args = process.argv.slice(2);
        const command = args[0];
        await databaseAPIservice();

        const commandMap = {
            'danh sach': () => handleDanhSach(args),
            'thongke': handleThongKe,
            'xuat': () => handleXuat(args),
            'xoa': () => handleXoa(args),
            'cuu': handleHelp,
            undefined: handleHelp,
        };

        if (commandMap[command]) {
            await commandMap[command]();
        } else {
            console.log(`Lệnh không hợp lệ: ${command}`);
            console.log('Sử dụng "node xemnhatKy cuu" để xem trợ giúp.');
        }
    } catch (error) {
        console.error('Lỗi:', error.message);
    }
}



// Đảm bảo script luôn chạy hàm main khi thực thi bằng Node.js (ES module)
main().catch(console.error);

export {
    queryLogs,
    getLogStats,
    exportLogsToCSV,
    deleteOldLogs
};