// scripts/tao-du-lieu-mau.js
// Script tạo dữ liệu mẫu cho label và user với vai trò nghệ sĩ (ARTIST)

const { PrismaClient } = require('@prisma/client')
const bcryptjs = require('bcryptjs')
const prisma = new PrismaClient()

/**
 * Tạo dữ liệu mẫu cho hệ thống
 */
async function taoDuLieuMau() {
  console.log('🚀 Bắt đầu tạo dữ liệu mẫu...')
  
  try {
    // 1. Kiểm tra kết nối database
    console.log('🔍 Đang kiểm tra kết nối database...')
    await prisma.$connect()
    console.log('✅ Kết nối database thành công!')
    
    // 2. Kiểm tra admin user
    console.log('👤 Kiểm tra tài khoản quản trị...')
    const adminUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: 'admin@ankun.dev' },
          { roles: { hasSome: ['ADMINISTRATOR'] } }
        ]
      }
    })
    
    if (!adminUser) {
      console.log('⚠️ Chưa có tài khoản quản trị, tạo mới...')
      await taoAdminUser()
    } else {
      console.log('✅ Đã tìm thấy tài khoản quản trị:', adminUser.email)
    }
    
    // 3. Tạo label nếu chưa có
    console.log('🏷️ Kiểm tra và tạo label...')
    const labelCount = await prisma.label.count()
    
    if (labelCount === 0) {
      console.log('⚠️ Chưa có label nào, tạo label mẫu...')
      await taoLabel()
    } else {
      console.log(`✅ Đã có ${labelCount} label trong hệ thống`)
    }
    
    // 4. Tạo user với vai trò nghệ sĩ (ARTIST)
    console.log('🎵 Tạo user vai trò ARTIST...')
    await taoUserArtist()
    
    // 5. Tạo các bản ghi nhật ký hệ thống
    console.log('📝 Tạo nhật ký hệ thống...')
    await taoNhatKyHeThong()
    
    console.log('✅ Hoàn tất tạo dữ liệu mẫu!')
  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', error)
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Tạo tài khoản quản trị
 */
async function taoAdminUser() {
  const adminUsername = process.env.ADMIN_USERNAME || 'ankunstudio'
  const adminPassword = process.env.ADMIN_PASSWORD || '@iamAnKun'
  
  // Mã hóa mật khẩu
  const hashedPassword = await bcryptjs.hash(adminPassword, 10)
  
  const admin = await prisma.user.create({
    data: {
      id: '1',  // ID cố định để dễ tham chiếu
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
          facebookUrl: 'https://facebook.com/ankun.dev',
          youtubeUrl: 'https://youtube.com/@ankun.dev',
          instagramUrl: 'https://instagram.com/ankun.dev',
          socialLinks: {
            facebook: '',
            youtube: '',
            spotify: '',
            appleMusic: '',
            tiktok: '',
            instagram: ''
          }
        }
      }
    }
  })
  
  console.log('✅ Đã tạo tài khoản quản trị:', admin.email)
  return admin
}

/**
 * Tạo label mẫu
 */
async function taoLabel() {
  // Lấy admin user
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@ankun.dev' }
  })
  
  if (!admin) {
    console.error('❌ Không tìm thấy tài khoản admin để liên kết với label')
    return null
  }
  
  const label = await prisma.label.create({
    data: {
      id: '1',  // ID cố định để dễ tham chiếu
      name: 'An Kun Studio',
      ownerId: admin.id
    }
  })
  
  // Cập nhật user với labelId
  await prisma.user.update({
    where: { id: admin.id },
    data: { labelId: label.id }
  })
  
  console.log('✅ Đã tạo label:', label.name)
  return label
}

/**
 * Tạo user với vai trò nghệ sĩ (ARTIST)
 */
async function taoUserArtist() {
  // Danh sách user nghệ sĩ mẫu
  const userArtistList = [
    {
      id: '2', // ID cố định để dễ tham chiếu
      email: 'artist1@ankun.dev',
      name: 'Nghệ Sĩ Mẫu 1',
      password: 'artist123',
      artistName: 'Artist Demo 1',
      bio: 'Nghệ sĩ demo cho hệ thống An Kun Studio'
    },
    {
      id: '3', // ID cố định để dễ tham chiếu
      email: 'artist2@ankun.dev',
      name: 'Nghệ Sĩ Mẫu 2',
      password: 'artist123',
      artistName: 'Artist Demo 2',
      bio: 'Nghệ sĩ demo thứ hai cho hệ thống'
    }
  ]
  
  // Lấy label
  const label = await prisma.label.findFirst({
    where: { name: 'An Kun Studio' }
  })
  
  if (!label) {
    console.error('❌ Không tìm thấy label để liên kết với user ARTIST')
    return
  }
  
  // Tạo các user với vai trò ARTIST
  for (const artistData of userArtistList) {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: artistData.email }
    })
    
    if (existingUser) {
      console.log(`ℹ️ User ${artistData.email} đã tồn tại, bỏ qua`)
      continue
    }
    
    // Mã hóa mật khẩu
    const hashedPassword = await bcryptjs.hash(artistData.password, 10)
    
    // Tạo user với vai trò ARTIST
    const artist = await prisma.user.create({
      data: {
        id: artistData.id,
        email: artistData.email,
        name: artistData.name,
        password: hashedPassword,
        roles: ['ARTIST'],
        labelId: label.id,
        profile: {
          create: {
            bio: artistData.bio,
            fullName: artistData.name,
            artistName: artistData.artistName,
            verified: true,
            facebookUrl: `https://facebook.com/${artistData.artistName.toLowerCase().replace(/\s+/g, '')}`,
            youtubeUrl: `https://youtube.com/@${artistData.artistName.toLowerCase().replace(/\s+/g, '')}`,
            instagramUrl: `https://instagram.com/${artistData.artistName.toLowerCase().replace(/\s+/g, '')}`,
            socialLinks: {
              facebook: '',
              youtube: '',
              spotify: '',
              appleMusic: '',
              tiktok: '',
              instagram: ''
            }
          }
        }
      }
    })
    
    console.log(`✅ Đã tạo user ARTIST: ${artist.name} (${artist.email})`)
  }
}

/**
 * Tạo nhật ký hệ thống
 */
async function taoNhatKyHeThong() {
  // Lấy admin user
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@ankun.dev' }
  })
  
  // Danh sách các hoạt động mẫu
  const hoatDongMau = [
    {
      action: 'system_init',
      details: {
        message: 'Hệ thống đã được khởi tạo thành công',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      }
    },
    {
      action: 'database_setup',
      details: {
        message: 'Cấu trúc database đã được thiết lập',
        tables: ['User', 'Profile', 'Label', 'nhatKy'],
        status: 'success'
      }
    },
    {
      action: 'test_data_creation',
      details: {
        message: 'Dữ liệu mẫu đã được tạo thành công',
        entities: ['Admin user', 'Label', 'Artists'],
        status: 'success'
      }
    }
  ]
  
  // Tạo các bản ghi nhật ký
  for (const hoatDong of hoatDongMau) {
    await prisma.nhatKy.create({
      data: {
        action: hoatDong.action,
        details: hoatDong.details,
        userId: admin?.id
      }
    })
    
    console.log(`✅ Đã tạo nhật ký: ${hoatDong.action}`)
  }
}

// Thực thi script
taoDuLieuMau()
  .then(() => console.log('📋 Tạo dữ liệu mẫu đã hoàn tất'))
  .catch((e) => {
    console.error('❌ Lỗi không xác định:', e)
    process.exit(1)
  })
