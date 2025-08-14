import { prisma } from './prisma'
import * as bcrypt from 'bcryptjs'
import type { User } from '@/types/user'

export async function authenticateUserWithDatabase(userId: string, password: string): Promise<User | null> {
  try {
    // Tìm user trong bảng User (theo userID), lấy luôn profile
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      include: {
        profile: true
      }
    });

    if (!user) return null;

    // Kiểm tra mật khẩu
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    // Xử lý liên kết xã hội thành json chuẩn
    let socialRawObj: Record<string, string> = {};
    if (
      user.profile?.socialLinks &&
      typeof user.profile.socialLinks === 'object' &&
      !Array.isArray(user.profile.socialLinks)
    ) {
      socialRawObj = user.profile.socialLinks as Record<string, string>;
    }
    const socialLinks: Record<string, string> = {};
    // Danh sách nền tảng phổ biến
    const platforms = [
      { key: 'facebook', domain: 'facebook.com/' },
      { key: 'youtube', domain: 'youtube.com/@' },
      { key: 'spotify', domain: 'open.spotify.com/artist/' },
      { key: 'appleMusic', domain: 'music.apple.com/vn/artist/' },
      { key: 'tiktok', domain: 'tiktok.com/@' },
      { key: 'instagram', domain: 'instagram.com/' },
    ];
    platforms.forEach(({ key, domain }) => {
      let value = '';
      switch (key) {
        case 'facebook': {
          const raw = socialRawObj.facebook ?? user.profile?.facebookUrl ?? '';
          value = String(raw);
          break;
        }
        case 'youtube':
          value = socialRawObj.youtube ?? user.profile?.youtubeUrl ?? '';
          break;
        case 'spotify':
          value = socialRawObj.spotify ?? user.profile?.spotifyUrl ?? '';
          break;
        case 'appleMusic':
          value = socialRawObj.appleMusic ?? user.profile?.appleMusicUrl ?? '';
          break;
        case 'tiktok':
          value = socialRawObj.tiktok ?? '';
          break;
        case 'instagram':
          value = socialRawObj.instagram ?? user.profile?.instagramUrl ?? '';
          break;
        default:
        // Giá trị sẳn sàng chuyển sang dạng Json và lưu vào 'CSDL'
      }
      if (value) {
        if (!value.startsWith('http') && !value.includes(domain)) {
          if (['tiktok', 'appleMusic', 'spotify'].includes(key)) {
            socialLinks[key] = value.replace('@', '');
          } else {
            socialLinks[key] = `https://${domain}${value.replace('@', '')}`;
          }
        } else {
          socialLinks[key] = value;
        }
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      password: undefined, // Không hiển thị mật khẩu mà chuyển sang ......... (ẩn đi)
      roles: Array.isArray(user.roles) ? user.roles : [user.roles],
      fullName: user.profile?.fullName ?? user.name ?? undefined,
      createdAt: user.createdAt.toISOString(),
      avatar: user.profile?.avatarUrl ?? process.env.COMPANY_AVATAR,
      bio: user.profile?.bio ?? '',
      socialLinks,
      verified: user.profile?.verified ?? false,
    };
  } catch (error) {
    console.error('Dữ liệu xác thực lỗi:', error);
    return null;
  }
}
