// scripts/migrate-database.js
// Script thực hiện migrate database và tạo dữ liệu mẫu

const { execSync } = require('child_process')
const { PrismaClient } = require('@prisma/client')
const path = require('path')
const fs = require('fs')
const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient()

/**
 * Tạo tài khoản quản trị với đầy đủ quyền
 */
async function createAdminUser() {
  const ADMIN = {
    userName: 'ankunstudio',
    Name: 'Nguyễn Mạnh An',
    Password: '@iamAnKun'
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcryptjs.hash(ADMIN.Password, 10)

  // Kiểm tra xem user đã tồn tại chưa
  const existingUser = await prisma.user.findFirst({
    where: { email: 'admin@ankun.dev' }
  })

  if (existingUser) {
    console.log('ℹ️ Tài khoản quản trị đã tồn tại, bỏ qua bước này')
    return existingUser
  }

  // Tạo người dùng mới với đầy đủ quyền
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ankun.dev',
      name: 'An Kun Studio Digital Music Distribution',
      password: hashedPassword,
      roles: ['ADMINISTRATOR', 'LABEL_MANAGER'],
      profile: {
        create: {
          bio: 'Send Gift Your Song to The World',
          fullName: 'An Kun Studio Digital Music Distribution',
          artistName: 'An Kun Studio',
          avatarUrl: '/face.png',
          verified: true,
          facebookUrl: 'https://facebook.com/iamankun',
          youtubeUrl: 'https://youtube.com/@ankun_music',
          instagramUrl: 'https://instagram.com/iamankun',
          applenusicUrl: 'https://music.apple.com/vn/artist/an-kun/1545463988',
          soundcloudUrl: 'https://soundcloud.com/iamankun',
          spotifyUrl: 'https://open.spotify.com/artist/5NIqsUlRfxkY4d2WjhcmXs',
          socialLinks: {
            [homeUrl: 'https://ankun.dev', facebookUrl: '@iamankun', youtubeUrl: '@@ankun_music', instagramUrl: '@iamankun', spotifyUrl: 'artist/5NIqsUlRfxkY4d2WjhcmXs', soundcloudUrl: 'iamankun', applenusicUrl: 'an-kun/1545463988']
          }
        }
      },
      label: {
        create: {
          name: 'An Kun Studio',
          ownerId: '1' // Sẽ được cập nhật sau khi tạo
        }
      }
    }
  })

  // Cập nhật label với đúng ownerId
  await prisma.label.update({
    where: { id: admin.label.id },
    data: { ownerId: admin.id }
  })

  // Tạo một bản ghi activity log đầu tiên
  await prisma.nhatKy.create({
    data: {
      action: 'system_init',
      details: {
        message: 'Hệ thống đã được khởi tạo thành công',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      },
      userId: admin.id
    }
  })

  return admin
}

async function migrateDatabase() {
  console.log('🚀 Bắt đầu quá trình migrate database...')

  try {
    // Kiểm tra kết nối database
    console.log('🔍 Đang kiểm tra kết nối database...')
    try {
      await prisma.$connect()
      console.log('✅ Kết nối database thành công')
    } catch (error) {
      console.error('❌ Lỗi kết nối database:', error.message)
      console.log('💡 Gợi ý: Kiểm tra lại biến môi trường DATABASE_URL trong file .env.local')
      return
    }

    // Tạo thư mục migrations nếu chưa tồn tại
    const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations')
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true })
      console.log('✅ Đã tạo thư mục migrations')
    }

    // 1. Tạo migration
    console.log('📝 Đang tạo migration...')
    try {
      execSync('npx prisma migrate dev --name tao_cau_truc_ban_dau', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
      console.log('✅ Tạo chuyển đổi thành công')
    } catch (error) {
      console.error('❌ Lỗi khi tạo chuyển đổi:', error.message)
      return
    }

    // 2. Chuyển đổi Prisma sang Postgres
    console.log('🔄 Đang tạo Prisma mới...')
    try {
      execSync('npx prisma generate', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      })
      console.log('✅ Tạo Prisma mới thành công')
    } catch (error) {
      console.error('❌ Lỗi khi tạo Prisma mới:', error.message)
      return
    }

    console.log('✅ Chuyển đổi dữ liệu từ Prisma sang Postgres hoàn tất')

    // 3. Tạo dữ liệu mẫu cho tài khoản quản trị
    console.log('👤 Đang tạo tài khoản quản trị mẫu...')
    try {
      await createAdminUser()
      console.log('✅ Đã tạo tài khoản quản trị thành công')
    } catch (error) {
      console.error('❌ Lỗi khi tạo tài khoản quản trị:', error.message)
    }

  } catch (error) {
    console.error('❌ Lỗi trong quá trình migrate:', error.message)
  }
}

migrateDatabase()
  .then(() => console.log('✅ Quá trình hoàn tất'))
  .catch((e) => {
    console.error('❌ Lỗi không xác định:', e)
    process.exit(1)
  })
