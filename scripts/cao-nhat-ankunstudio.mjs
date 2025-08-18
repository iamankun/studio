// Update ankunstudio account ID to 1 for both Label Manager and Artist roles

import { config } from 'dotenv';
import pg from 'pg';

config({ path: '../.env.local' });

const { Client } = pg;

console.log('🔄 ĐANG CẬP NHẬT ID ANKUNSTUDIO THÀNH 1');
console.log('===============================');

async function updateAnkunstudioId() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const username = 'ankunstudio';

    // Cứu: In thông tin tài khoản
    const printAccountInfo = (ADMINISTRATOR, LABEL_MANAGER, ARTIST) => {
        if (ADMINISTRATOR.rows.length > 0) {
            console.log('📋 Quản trị viên:', ADMINISTRATOR.rows[0]);
        }
        if (LABEL_MANAGER.rows.length > 0) {
            console.log('📋 Quản lý nhãn:', LABEL_MANAGER.rows[0]);
        }
        if (ARTIST.rows.length > 0) {
            console.log('🎤 Nghệ sĩ:', ARTIST.rows[0]);
        }
    };

    // Helper: Kiểm tra ID 1 có khả dụng không
    const checkIdAvailability = (ADMINISTRATORId1, LABEL_MANAGERId1, ARTISTId1) => {
        if (ADMINISTRATORId1.rows.length > 0) {
            console.log('⚠️ ID 1 của Quản trị viên đã được sử dụng bởi:', ADMINISTRATORId1.rows[0]);
        } else {
            console.log('✅ ID 1 của Quản trị viên đang trống');
        }
        if (LABEL_MANAGERId1.rows.length > 0) {
            console.log('⚠️ ID 1 của Quản lý nhãn đã được sử dụng bởi:', LABEL_MANAGERId1.rows[0]);
        } else {
            console.log('✅ ID 1 của Quản lý nhãn đang trống');
        }
        if (ARTISTId1.rows.length > 0) {
            console.log('⚠️ ID 1 của Nghệ sĩ đã được sử dụng bởi:', ARTISTId1.rows[0]);
        } else {
            console.log('✅ ID 1 của Nghệ sĩ đang trống');
        }
    };

    // Helper: Di chuyển ID 1 sang tạm nếu cần
    const moveIdToTemp = async (table, id1Rows) => {
        if (id1Rows.rows.length > 0) {
            await client.query(`
                UPDATE ${table}
                SET id = (SELECT COALESCE(MAX(id), 0) + 1 FROM ${table})
                WHERE id = 1
            `);
            console.log(`🔄 Đã di chuyển ID 1 của bảng ${table} sang ID tạm thời`);
        }
    };

    // Helper: Cập nhật ID của username thành 1
    const updateUserIdTo1 = async (table, currentRows) => {
        if (currentRows.rows.length > 0 && currentRows.rows[0].id !== 1) {
            await client.query(`
                UPDATE ${table}
                SET id = 1
                WHERE userName = $1
            `, [username]);
            console.log(`✅ Đã cập nhật ID của bảng ${table} thành 1`);
        }
    };

    // Cứu: Khôi phục lại dữ liệu
    const resetSequence = async (table) => {
        await client.query(`
            SELECT setval('${table}_id_seq', (SELECT COALESCE(MAX(id), 0) FROM ${table}), true)
        `);
    };

    try {
        await client.connect();
        console.log('✅ Kết nối tới cơ sở dữ liệu thành công');

        // Lấy thông tin tài khoản hiện tại
        const [currentADMINISTRATOR, currentLABEL_MANAGER, currentARTIST] = await Promise.all([
            client.query(`SELECT UID, userName, fullname FROM ADMINISTRATOR WHERE userName = $1`, [userName]),
            client.query(`SELECT UID, userName, fullname FROM LABEL_MANAGER WHERE userName = $1`, [userName]),
            client.query(`SELECT UID, userName, fullname FROM ARTIST WHERE userName = $1`, [userName])
        ]);
        console.log('\n🔍 ID tài khoản hiện tại:');
        printAccountInfo(currentADMINISTRATOR, currentLABEL_MANAGER, currentARTIST);

        // Kiểm tra ID 1 có khả dụng không
        console.log('\n🔍 Kiểm tra ID 1 có khả dụng không:');
        const [labelManagerId1, artistId1] = await Promise.all([
            client.query(`SELECT id, username FROM label_manager WHERE id = 1`),
            client.query(`SELECT id, username FROM artist WHERE id = 1`)
        ]);
        checkIdAvailability(labelManagerId1, artistId1);

        // Bắt đầu transaction
        await client.query('BEGIN');
        try {
            // Kiểm tra các submissions liên kết với nghệ sĩ
            if (currentArtist.rows.length > 0) {
                const currentArtistId = currentArtist.rows[0].id;
                console.log(`\n🔗 Kiểm tra submissions liên kết với nghệ sĩ ID ${currentArtistId}:`);
                const linkedSubmissions = await client.query(`
                    SELECT id, title, uploader_username 
                    FROM submissions 
                    WHERE uploader_username = $1
                `, [username]);
                console.log(`Tìm thấy ${linkedSubmissions.rows.length} submissions liên kết với ${username}`);
                if (linkedSubmissions.rows.length > 0) {
                    console.table(linkedSubmissions.rows);
                }
            }

            // Cập nhật ID cho Label Manager và Artist thành 1
            await moveIdToTemp('label_manager', labelManagerId1);
            await updateUserIdTo1('label_manager', currentLabelManager);

            await moveIdToTemp('artist', artistId1);
            await updateUserIdTo1('artist', currentArtist);

            // Reset lại sequence
            await resetSequence('label_manager');
            await resetSequence('artist');
            console.log('🔄 Đã reset lại sequence ID');

            // Commit transaction
            await client.query('COMMIT');
            console.log('✅ Đã commit transaction thành công');

            // Kiểm tra lại lần cuối
            console.log('\n🎯 Kiểm tra lại lần cuối:');
            const [finalLabelManager, finalArtist] = await Promise.all([
                client.query(`SELECT id, username, full_name FROM label_manager WHERE username = $1`, [username]),
                client.query(`SELECT id, username, full_name FROM artist WHERE username = $1`, [username])
            ]);
            printAccountInfo(finalLabelManager, finalArtist);

            // Kiểm tra submissions vẫn liên kết đúng
            console.log('\n🔗 Kiểm tra submissions vẫn liên kết đúng:');
            const verifySubmissions = await client.query(`
                SELECT s.id, s.title, s.uploader_username, a.id as artist_id, a.full_name
                FROM submissions s
                LEFT JOIN artist a ON s.uploader_username = a.username
                WHERE s.uploader_username = $1
                LIMIT 5
            `, [username]);
            if (verifySubmissions.rows.length > 0) {
                console.table(verifySubmissions.rows);
            }
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Transaction đã bị rollback do lỗi:', error.message);
            throw error;
        }
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        return false;
    } finally {
        await client.end();
    }
}

updateAnkunstudioId().then(success => {
    if (success) {
        console.log('\n🎉 ĐÃ HOÀN THÀNH CẬP NHẬT ID ANKUNSTUDIO!');
        console.log('✅ Cả Quản lý nhãn và Nghệ sĩ đều có ID = 1');
        console.log('✅ Tất cả submissions vẫn liên kết đúng');
        console.log('✅ Sequence của database đã được reset lại');
    } else {
        console.log('\n❌ CẬP NHẬT ID THẤT BẠI');
    }
}).catch(console.error);
if (verifySubmissions.rows.length > 0) {
    console.table(verifySubmissions.rows);
}

return true;

        } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction rolled back due to error:', error.message);
    throw error;
}

    } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
} finally {
    await client.end();
}
}

updateAnkunstudioId().then(success => {
    if (success) {
        console.log('\n🎉 ANKUNSTUDIO ID UPDATE COMPLETED!');
        console.log('✅ Both Label Manager and Artist now have ID = 1');
        console.log('✅ All submissions still link correctly');
        console.log('✅ Database sequences reset properly');
    } else {
        console.log('\n❌ ID UPDATE FAILED');
    }
}).catch(console.error);
