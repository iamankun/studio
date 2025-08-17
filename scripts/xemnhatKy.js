// @ts-check
/**
 * Script để quản lý và xem log hoạt động trong bảng nhat_ky_studio
 * Dùng để truy vấn, tìm kiếm và xuất báo cáo từ bảng log
 */

import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { UserRole } from '@prisma/client';

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
    return (DATABASE_URL);
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
 * @param {string} [options.sortBy='created_at'] - Sắp xếp theo trường
 * @param {string} [options.sortOrder='DESC'] - Thứ tự sắp xếp (ASC/DESC)
 * @returns {Promise<Array>} - Danh sách logs
 */
async function queryLogs(options = {}) {
    const {
        limit = 50,
        userUID,
        userName,
        action,
        category,
        status,
        componentName,
        startDate,
        endDate,
        sortBy = 'Tạo bởi',
        sortOrder = 'DESC'
    } = options;

    try {
        const sql = await databaseAPIservice();

        // Bắt đầu câu truy vấn
        let query = sql`SELECT * FROM nhatKy WHERE 1=1`;

        // Thêm các điều kiện lọc

        if (userUID) {
            query = sql`${query} AND userUID = ${userUID}`;
        }

        if (userName) {
            query = sql`${query} AND userName = ${userName}`;
        }

        if (action) {
            query = sql`${query} AND action = ${action}`;
        }

        if (category) {
            query = sql`${query} AND category = ${category}`;
        }

        if (status) {
            query = sql`${query} AND status = ${status}`;
        }

        if (componentName) {
            query = sql`${query} AND component_name = ${componentName}`;
        }

        if (startDate) {
            query = sql`${query} AND created_at >= ${startDate}`;
        }

        if (endDate) {
            query = sql`${query} AND created_at <= ${endDate}`;
        }

        // Thêm sắp xếp và giới hạn
        if (sortOrder === 'ASC') {
            query = sql`${query} ORDER BY ${sortBy} ASC LIMIT ${limit}`;
        } else {
            query = sql`${query} ORDER BY ${sortBy} DESC LIMIT ${limit}`;
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
        const totalLogs = await sql`SELECT COUNT(*) as count FROM nhatKy`;

        // Thống kê theo hành động
        const actionStats = await sql`
            SELECT action, COUNT(*) as count
            FROM nhatKy
            GROUP BY action
            ORDER BY count DESC
        `;

        // Thống kê theo tài khoản
        const userStats = await sql`
            SELECT username, COUNT(*) as count
            FROM nhatKy
            GROUP BY username
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
            SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count
            FROM nhatKy
            WHERE created_at >= NOW() - INTERVAL '7 days'
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
        const defaultFilename = `nhatky-${new Date().toISOString().replace(/:/g, '-')}.csv`;
        const csvFilePath = path.join(exportDir, filename ?? defaultFilename);

        // Tạo header CSV
        const headers = [
            'ID', 'UserUID', 'username', 'Action', 'Category',
            'IP', 'User Agent', 'Status', 'CreatedAt',
            'Component Name', 'Session ID', 'Related IDs', 'Details'
        ];

        // Tạo nội dung CSV
        let csvContent = headers.join(',') + '\n';

        for (const log of logs) {
            const row = [
                log.id,
                `"${(log.userUID || '').replace(/"/g, '""')}"`,
                `"${(log.username || '').replace(/"/g, '""')}"`,
                `"${(log.action || '').replace(/"/g, '""')}"`,
                `"${(log.category || '').replace(/"/g, '""')}"`,
                `"${(log.ip_address || '').replace(/"/g, '""')}"`,
                `"${(log.user_agent || '').replace(/"/g, '""')}"`,
                `"${(log.status || '').replace(/"/g, '""')}"`,
                log.created_at ? new Date(log.created_at).toISOString() : '',
                `"${(log.component_name || '').replace(/"/g, '""')}"`,
                `"${(log.session_id || '').replace(/"/g, '""')}"`,
                `"${JSON.stringify(log.related_ids || {}).replace(/"/g, '""')}"`,
                `"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`
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

// Hàm main để xử lý tham số dòng lệnh
async function main() {
    try {
        // Kiểm tra tham số dòng lệnh
        const args = process.argv.slice(2);
        const command = args[0];

        // Kết nối đến database
        await databaseAPIservice();

        if (!command ?? command === 'cứu') {
            console.log('=== QUẢN LÝ NHẬT KÝ STUDIO ===');
            console.log('Sử dụng: node xemnhatKy.js [lệnh] [tham số]');
            console.log('\nCác lệnh:');
            console.log('  danh sach [limit] [--user=X] [--userUID=X] [--action=X] [--category=X] [--status=X] [--component=X] - Liệt kê nhật ký');
            console.log('  thong ke                                                     - Hiển thị thống kê');
            console.log('  xuat [filename] [--limit=X]                                 - Xuất ra tệp CSV');
            console.log('  xoa [days]                                                  - Xóa nhật ký cũ');
            console.log('  cuu                                                          - Hiển thị trợ giúp');
            return;
        }

        // Xử lý các lệnh
        switch (command) {
            case 'danh sach': {
                // Khớp tham số
                let limit = 50;
                let userUID;
                let userName;
                let action;
                let category;
                let status;
                let componentName;

                if (args[1] && !args[1].startsWith('--')) {
                    limit = parseInt(args[1], 10) ?? 50;
                }

                // Parse tham số dạng --key=value
                for (const arg of args) {
                    if (arg.startsWith('--userUID=')) {
                        userUID = arg.substring(9);
                    } else if (arg.startsWith('--username=')) {
                        userName = arg.substring(11);
                    } else if (arg.startsWith('--action=')) {
                        action = arg.substring(9);
                    } else if (arg.startsWith('--category=')) {
                        category = arg.substring(11);
                    } else if (arg.startsWith('--status=')) {
                        status = arg.substring(9);
                    } else if (arg.startsWith('--component=')) {
                        componentName = arg.substring(12);
                    }
                }

                console.log(`=== DANH SÁCH LOG (tối đa ${limit}) ===`);
                if (userUID) console.log(`Lọc theo UID: ${userUID}`);
                if (userName) console.log(`Lọc theo tài khoản: ${userName}`);
                if (action) console.log(`Lọc theo hành động: ${action}`);
                if (category) console.log(`Lọc theo hạng mục: ${category}`);
                if (status) console.log(`Lọc theo trạng thái: ${status}`);
                if (componentName) console.log(`Lọc theo gói: ${componentName}`);

                const logs = await queryLogs({
                    limit,
                    userUID,
                    userName,
                    action,
                    category,
                    status,
                    componentName
                });

                console.log(`\nĐã tìm thấy ${logs.length} nhật ký:`);

                for (const log of logs) {
                    console.log('-'.repeat(80));
                    console.log(`ID: ${log.id} | Thời gian: ${log.created_at}`);
                    console.log(`User: ${log.userUID ?? 'N/A'} (UID: ${log.userUID ?? 'N/A'})`);
                    console.log(`Action: ${log.action ?? 'N/A'} | Category: ${log.category ?? 'N/A'} | Status: ${log.status ?? 'N/A'}`);
                    console.log(`Component: ${log.component_name ?? 'N/A'} | Session: ${log.session_id ?? 'N/A'}`);
                    console.log(`IP: ${log.ip_address ?? 'N/A'}`);
                    console.log(`Details: ${JSON.stringify(log.details ?? {})}`);
                    if (log.related_ids) {
                        console.log(`Related IDs: ${JSON.stringify(log.related_ids)}`);
                    }
                }

                break;
            }

            case 'thongke': {
                console.log('=== THỐNG KÊ NHẬT KÝ STUDIO ===');

                const stats = await getLogStats();

                console.log(`\nTổng số nhật ký: ${stats.total}`);

                console.log('\n=== THỐNG KÊ THEO LOẠI HÀNH ĐỘNG ===');
                for (const item of stats.byAction) {
                    console.log(`- ${item.action}: ${item.count} nhật ký`);
                }

                console.log('\n=== THỐNG KÊ THEO DANH MỤC ===');
                for (const item of stats.byCategory) {
                    console.log(`- ${item.category}: ${item.count} nhật ký`);
                }

                console.log('\n=== THỐNG KÊ THEO NGƯỜI DÙNG ===');
                for (const item of stats.byUser) {
                    console.log(`- ${item.username || 'Không xác định'}: ${item.count} nhật ký`);
                }

                console.log('\n=== THỐNG KÊ THEO COMPONENT ===');
                for (const item of stats.byComponent) {
                    console.log(`- ${item.component_name || 'Không xác định'}: ${item.count} nhật ký`);
                }

                console.log('\n=== THỐNG KÊ THEO NGÀY (7 NGÀY GẦN NHẤT) ===');
                for (const item of stats.byDate) {
                    const date = new Date(item.date).toISOString().split('T')[0];
                    console.log(`- ${date}: ${item.count} log`);
                }

                console.log('\n=== THỐNG KÊ THEO TRẠNG THÁI ===');
                for (const item of stats.byStatus) {
                    console.log(`- ${item.status ?? 'N/A'}: ${item.count} nhật ký`);
                }

                break;
            }

            case 'xuat': {
                // Parse tham số
                let filename = args[1];
                let limit = 1000;

                // Parse tham số dạng --key=value
                for (const arg of args) {
                    if (arg.startsWith('--limit=')) {
                        limit = parseInt(arg.substring(8), 10) || 1000;
                    }
                }

                console.log(`=== XUẤT NHẬT KÝ (tối đa ${limit}) ===`);

                const logs = await queryLogs({ limit });
                const csvPath = await exportLogsToCSV(logs, filename);

                console.log(`\nĐã xuất ${logs.length} nhật ký ra tệp:`);
                console.log(csvPath);

                break;
            }

            case 'xoa': {
                // Khớp tham số
                const days = parseInt(args[1], 10) ?? 30;

                // Xác nhận trước khi xóa
                console.log(`=== XÓA NHẬT KÝ CŨ (> ${days} ngày) ===`);
                console.log('\nCảnh báo: Hành động này không thể hoàn tác!');
                console.log('Hệ thống sẽ xóa nhật ký cũ hơn ' + days + ' ngày.');

                // Xóa nhật ký cũ
                const deletedCount = await deleteOldLogs(days);
                console.log(`\nĐã xóa ${deletedCount} nhật ký cũ.`);

                break;
            }

            default:
                console.log(`Lệnh không hợp lệ: ${command}`);
                console.log('Sử dụng "node xemnhatKy cuu" để xem trợ giúp.');
        }
    } catch (error) {
        console.error('Lỗi:', error.message);
    }
}

// Chạy chương trình
// Trong ES modules, chúng ta sử dụng import.meta.url để kiểm tra xem tệp này có đang được chạy trực tiếp hay không
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export {
    queryLogs,
    getLogStats,
    exportLogsToCSV,
    deleteOldLogs
};
};
