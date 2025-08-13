// scripts/kiem-tra-database-hoan-chinh.js
// Script kiểm tra database toàn diện và tạo tài khoản đầu tiên

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function kiemTraVaTaoDuLieu() {
    console.log('🔍 Đang kiểm tra kết nối database...')

    try {
        // Kiểm tra kết nối
        await prisma.$connect()
        console.log('✅ Kết nối database thành công!')

        // === KIỂM TRA CÁC BẢNG CHÍNH ===
        console.log('\n📊 Đang kiểm tra schema và các bảng...')

        const tables = {
            User: 0,
            Profile: 0,
            Label: 0,
            Submission: 0,
            Track: 0,
            File: 0,
            FileFolder: 0,
            nhatKy: 0
        }

        // Kiểm tra từng bảng
        for (const [tableName, _] of Object.entries(tables)) {
            try {
                const count = await prisma[tableName.toLowerCase()].count()
                tables[tableName] = count
                console.log(`   ✅ Bảng ${tableName}: ${count} bản ghi`)
            } catch (error) {
                console.log(`   ❌ Bảng ${tableName}: Chưa tồn tại hoặc lỗi`)
                if (error.code === 'P2021') {
                    console.log(`      💡 Cần chạy prisma migrate để tạo bảng ${tableName}`)
                }
            }
        }

        // === XỬ LÝ TÀI KHOẢN QUẢN TRỊ ===
        console.log('\n👤 Kiểm tra tài khoản quản trị...')

        try {
            // Tìm tài khoản admin hiện có
            const existingAdmin = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: 'ankunstudio@ankun.dev' },
                        { email: 'admin@ankun.dev' },
                        { roles: { hasSome: ['ADMINISTRATOR'] } }
                    ]
                },
                include: {
                    profile: true,
                    label: true
                }
            })

            if (existingAdmin) {
                console.log('✅ Đã tìm thấy tài khoản quản trị:')
                console.log(`   - ID: ${existingAdmin.id}`)
                console.log(`   - Email: ${existingAdmin.email}`)
                console.log(`   - Tên: ${existingAdmin.name}`)
                console.log(`   - Vai trò: ${JSON.stringify(existingAdmin.roles)}`)
                console.log(`   - Profile: ${existingAdmin.profile ? 'Có' : 'Chưa có'}`)
                console.log(`   - Label: ${existingAdmin.label?.name || 'Chưa có'}`)
                console.log(`   - Tạo lúc: ${new Date(existingAdmin.createdAt).toLocaleString()}`)

                // Ghi log kiểm tra
                await prisma.nhatKy.create({
                    data: {
                        action: 'KIEM_TRA_TAI_KHOAN_QUAN_TRI',
                        details: {
                            userEmail: existingAdmin.email,
                            roles: existingAdmin.roles,
                            checkTime: new Date().toISOString(),
                            scriptName: 'kiem-tra-database-hoan-chinh.js'
                        },
                        userId: existingAdmin.id
                    }
                })

            } else {
                console.log('⚠️ Chưa có tài khoản quản trị trong hệ thống')
                console.log('🔨 Đang tạo tài khoản ankunstudio với đủ quyền...')

                // Tạo tài khoản mới
                const newUser = await prisma.user.create({
                    data: {
                        email: 'ankunstudio@ankun.dev',
                        name: 'An Kun Studio',
                        password: '@iamAnKun',
                        roles: ['ADMINISTRATOR', 'LABEL_MANAGER', 'ARTIST']
                    }
                })

                // Tạo profile
                const newProfile = await prisma.profile.create({
                    data: {
                        userId: newUser.id,
                        artistName: 'An Kun',
                        fullName: 'Nguyễn Mạnh An',
                        bio: 'Tài khoản hệ thống đầu tiên với đủ quyền quản trị, label manager và nghệ sĩ. Được tạo tự động bởi script.',
                        verified: true,
                        facebookUrl: 'https://facebook.com/ankunstudio',
                        instagramUrl: 'https://instagram.com/ankunstudio',
                        youtubeUrl: 'https://youtube.com/@ankunstudio'
                    }
                })

                // Ghi log tạo tài khoản
                await prisma.nhatKy.create({
                    data: {
                        action: 'TAO_TAI_KHOAN_QUAN_TRI_DAU_TIEN',
                        details: {
                            userEmail: newUser.email,
                            userName: newUser.name,
                            roles: newUser.roles,
                            profileId: newProfile.id,
                            createdTime: new Date().toISOString(),
                            note: 'Tài khoản được tạo tự động bởi script kiểm tra database',
                            scriptName: 'kiem-tra-database-hoan-chinh.js'
                        },
                        userId: newUser.id
                    }
                })

                console.log('✅ Đã tạo tài khoản ankunstudio thành công:')
                console.log(`   - ID: ${newUser.id}`)
                console.log(`   - Email: ${newUser.email}`)
                console.log(`   - Tên: ${newUser.name}`)
                console.log(`   - Vai trò: ${JSON.stringify(newUser.roles)}`)
                console.log(`   - Profile ID: ${newProfile.id}`)
                console.log(`   - Tên nghệ sĩ: ${newProfile.artistName}`)
                console.log(`   - Tạo lúc: ${new Date(newUser.createdAt).toLocaleString()}`)
            }

        } catch (error) {
            console.error('❌ Lỗi khi xử lý tài khoản quản trị:', error.message)
            if (error.code === 'P2002') {
                console.log('💡 Email ankunstudio@ankun.dev đã tồn tại')
            }
        }

        // === KIỂM TRA MIGRATION ===
        console.log('\n🔄 Kiểm tra trạng thái Migration:')
        try {
            const migrations = await prisma.$queryRaw`
        SELECT migration_name, finished_at 
        FROM _prisma_migrations 
        ORDER BY finished_at DESC 
        LIMIT 5
      `
            console.log('   ✅ Lịch sử migrations gần nhất:')
            migrations.forEach((migration, index) => {
                console.log(`   ${index + 1}. ${migration.migration_name}`)
                console.log(`      - Hoàn thành: ${new Date(migration.finished_at).toLocaleString()}`)
            })
        } catch (error) {
            console.log('   ❌ Không thể truy cập lịch sử migrations')
            console.log('   💡 Cần chạy: npx prisma migrate dev')
        }

        // === HIỂN THỊ THỐNG KÊ TỔNG HỢP ===
        console.log('\n📈 Thống kê tổng hợp:')
        console.log(`   - Tổng số User: ${tables.User}`)
        console.log(`   - Tổng số Profile: ${tables.Profile}`)
        console.log(`   - Tổng số Label: ${tables.Label}`)
        console.log(`   - Tổng số Submission: ${tables.Submission}`)
        console.log(`   - Tổng số Track: ${tables.Track}`)
        console.log(`   - Tổng số File: ${tables.File}`)
        console.log(`   - Tổng số Nhật ký: ${tables.nhatKy}`)

        // === HIỂN THỊ THÔNG TIN KẾT NỐI ===
        const databaseUrl = process.env.DATABASE_URL || 'Không tìm thấy DATABASE_URL'
        console.log('\n🔗 Thông tin kết nối:')
        console.log(`   Database URL: ${databaseUrl.replace(/:[^:]*@/, ':****@')}`)

    } catch (error) {
        console.error('❌ Lỗi kết nối database:', error.message)
        console.log('💡 Kiểm tra lại DATABASE_URL trong file .env.local')

        // Hiển thị thông tin debug
        console.log('\n🔍 Thông tin debug:')
        console.log(`   - DATABASE_URL exists: ${!!process.env.DATABASE_URL}`)
        console.log(`   - Node version: ${process.version}`)
        console.log(`   - Platform: ${process.platform}`)

    } finally {
        await prisma.$disconnect()
    }
}

// === CHẠY SCRIPT ===
kiemTraVaTaoDuLieu()
    .then(() => {
        console.log('\n✅ Kiểm tra database hoàn tất thành công!')
        console.log('💡 Bạn có thể đăng nhập với: ankunstudio@ankun.dev / @iamAnKun')
    })
    .catch((error) => {
        console.error('\n❌ Lỗi không xác định:', error.message)
        console.error('Chi tiết lỗi:', error)
        process.exit(1)
    })
