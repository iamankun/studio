import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';

// LƯU Ý: Mã bí mật phải là một chuỗi bí mật dài ít nhất 32 ký tự.
// Bạn có thể tạo một chuỗi ngẫu nhiên bằng lệnh: openssl rand -hex 32
// và lưu nó vào file .env.local
const sessionOptions = {
  password: process.env.MA_BI_MAT as string,
  cookieName: 'aks-studio-session',
  cookieOptions: {
    // secure: true chỉ nên được bật trên môi trường production (HTTPS)
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  const session = await getIronSession<{ user?: User }>(await cookies(), sessionOptions);
  return session;
}