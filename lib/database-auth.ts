import { prisma } from './prisma'
import * as bcrypt from 'bcryptjs'
import type { User } from '@/types/user'

export async function authenticateUserWithDatabase(username: string, password: string): Promise<User | null> {
  try {
    // Tìm user trong database (có thể là Label Manager hoặc Artist)
    let user = null
    
    // Tìm trong bảng Label Manager trước
    const labelManager = await prisma.labelManager.findUnique({
      where: { username }
    })
    
    if (labelManager) {
      // Verify password
      const isValid = await bcrypt.compare(password, labelManager.password)
      if (isValid) {
        user = {
          id: labelManager.id.toString(),
          username: labelManager.username,
          role: 'Label Manager' as const,
          fullName: labelManager.fullName || labelManager.username,
          email: labelManager.email,
          avatar: labelManager.avatar || process.env.COMPANY_AVATAR || '/face.png',
          bio: labelManager.bio || '',
          socialLinks: {
            facebook: '',
            youtube: '',
            spotify: '',
            appleMusic: '',
            tiktok: '',
            instagram: '',
          },
          createdAt: labelManager.createdAt.toISOString(),
          isrcCodePrefix: labelManager.isrcCodePrefix || 'VNA2P',
        }
      }
    }
    
    // Nếu không tìm thấy Label Manager, tìm trong bảng Artist
    if (!user) {
      const artist = await prisma.artist.findUnique({
        where: { username }
      })
      
      if (artist) {
        // Verify password
        const isValid = await bcrypt.compare(password, artist.password)
        if (isValid) {
          user = {
            id: artist.id.toString(),
            username: artist.username,
            role: 'Artist' as const,
            fullName: artist.fullName || artist.username,
            email: artist.email,
            avatar: artist.avatar || process.env.COMPANY_AVATAR || '/face.png',
            bio: artist.bio || '',
            socialLinks: {
              facebook: artist.socialLinks?.facebook || '',
              youtube: artist.socialLinks?.youtube || '',
              spotify: artist.socialLinks?.spotify || '',
              appleMusic: artist.socialLinks?.appleMusic || '',
              tiktok: artist.socialLinks?.tiktok || '',
              instagram: artist.socialLinks?.instagram || '',
            },
            createdAt: artist.createdAt.toISOString(),
            isrcCodePrefix: 'VNA2P',
          }
        }
      }
    }
    
    return user
  } catch (error) {
    console.error('Database authentication error:', error)
    return null
  }
}
