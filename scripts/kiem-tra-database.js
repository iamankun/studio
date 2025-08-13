// scripts/kiem-tra-database.js
// Script kiểm tra kết nối database và tạo bảng nếu cần

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function kiemTraDatabase() {
  console.log('🔍 Đang kiểm tra kết nối database...')
  
  try {
    // Kiểm tra kết nối
    await prisma.$connect()
    console.log('✅ Kết nối database thành công!')
    
    // Kiểm tra schema hiện tại
    console.log('📊 Đang kiểm tra schema hiện tại...')
    
    // Thử query một bảng có thể không tồn tại để xem lỗi
    try {
      const nhatKyCount = await prisma.nhatKy.count()
      console.log(`✅ Bảng nhatKy đã tồn tại với ${nhatKyCount} bản ghi`)
      
      // Hiển thị 5 bản ghi mới nhất nếu có
      if (nhatKyCount > 0) {
        const latestLogs = await prisma.nhatKy.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: true }
        })
        
        console.log('\n📝 5 bản ghi nhật ký gần nhất:')
        latestLogs.forEach((log, index) => {
          console.log(`   ${index + 1}. [${new Date(log.createdAt).toLocaleString()}] ${log.action}`)
          console.log(`      Người dùng: ${log.user?.name || 'Không xác định'}`)
          console.log(`      Chi tiết: ${JSON.stringify(log.details, null, 2).substring(0, 100)}...`)
        })
      }
    } catch (error) {
      if (error.code === 'P2021') {
        console.error('❌ Bảng nhatKy chưa tồn tại trong database')
        console.log('💡 Cần chạy prisma migrate để tạo bảng')
      } else {
        console.error('❌ Lỗi khi truy vấn bảng nhatKy:', error.message)
      }
    }
    
    // Kiểm tra bảng User
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Bảng User đã tồn tại với ${userCount} bản ghi`)
      
      // Hiển thị thông tin tài khoản admin nếu có
      if (userCount > 0) {
        const adminUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: 'admin@ankun.dev' },
              { roles: { hasSome: ['ADMINISTRATOR', 'LABEL_MANAGER'] } }
            ]
          },
          include: {
            profile: true,
            label: true
          }
        })
        
        if (adminUser) {
          console.log('\n👤 Thông tin tài khoản quản trị:')
          console.log(`   - ID: ${adminUser.id}`)
          console.log(`   - Email: ${adminUser.email}`)
          console.log(`   - Tên: ${adminUser.name}`)
          console.log(`   - Vai trò: ${JSON.stringify(adminUser.roles)}`)
          console.log(`   - Label: ${adminUser.label?.name || 'Chưa có'}`)
          console.log(`   - Tạo lúc: ${new Date(adminUser.createdAt).toLocaleString()}`)
        } else {
          console.log('⚠️ Chưa có tài khoản quản trị trong hệ thống')
          console.log('💡 Chạy script migrate-database.js để tạo tài khoản quản trị')
        }
      }
    } catch (error) {
      if (error.code === 'P2021') {
        console.error('❌ Bảng User chưa tồn tại trong database')
        console.log('💡 Cần chạy prisma migrate để tạo bảng')
      } else {
        console.error('❌ Lỗi khi truy vấn bảng User:', error.message)
      }
    }
    
    // Kiểm tra URL kết nối database
    const databaseUrl = process.env.DATABASE_URL || 'Không tìm thấy DATABASE_URL'
    console.log('🔗 Database URL hiện tại:', databaseUrl.replace(/:[^:]*@/, ':****@'))
    
    // Kiểm tra các bảng khác
    console.log('\n📋 Kiểm tra các bảng khác:')
    
    // Kiểm tra bảng Label
    try {
      const labelCount = await prisma.label.count()
      console.log(`   - Bảng Label: ${labelCount} bản ghi`)
    } catch (error) {
      console.log(`   - Bảng Label: ❌ Chưa tồn tại`)
    }
    
    // Kiểm tra bảng Submission
    try {
      const submissionCount = await prisma.submission.count()
      console.log(`   - Bảng Submission: ${submissionCount} bản ghi`)
    } catch (error) {
      console.log(`   - Bảng Submission: ❌ Chưa tồn tại`)
    }
    
    // Kiểm tra bảng Track
    try {
      const trackCount = await prisma.track.count()
      console.log(`   - Bảng Track: ${trackCount} bản ghi`)
    } catch (error) {
      console.log(`   - Bảng Track: ❌ Chưa tồn tại`)
    }
    
    // Kiểm tra bảng File
    try {
      const fileCount = await prisma.file.count()
      console.log(`   - Bảng File: ${fileCount} bản ghi`)
    } catch (error) {
      console.log(`   - Bảng File: ❌ Chưa tồn tại`)
    }
    
    // Kiểm tra bảng FileFolder
    try {
      const folderCount = await prisma.fileFolder.count()
      console.log(`   - Bảng FileFolder: ${folderCount} bản ghi`)
    } catch (error) {
      console.log(`   - Bảng FileFolder: ❌ Chưa tồn tại`)
    }
    
    // Hiển thị trạng thái migration
    console.log('\n🔄 Trạng thái Migration:')
    try {
      // Kiểm tra bảng _prisma_migrations nếu có
      const migrations = await prisma.$queryRaw`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5`
      console.log('   ✅ Đã tìm thấy lịch sử migrations:')
      migrations.forEach((migration, index) => {
        console.log(`   ${index + 1}. ${migration.migration_name} - ${new Date(migration.finished_at).toLocaleString()}`)
      })
    } catch (error) {
      console.log('   ❌ Không thể truy cập lịch sử migrations')
      console.log('   💡 Cần chạy prisma migrate để khởi tạo migrations')
    }
    
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message)
    console.log('💡 Kiểm tra lại DATABASE_URL trong file .env.local')
  } finally {
    await prisma.$disconnect()
  }
}

kiemTraDatabase()
  .then(() => console.log('✅ Kiểm tra database hoàn tất'))
  .catch((e) => {
    console.error('❌ Lỗi không xác định:', e)
    process.exit(1)
  })
