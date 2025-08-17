import Link from 'next/link';
import React from 'react';

const previews = [
  { name: 'File Data Demo', href: '/previews/file' },
  { name: 'Success Animation', href: '/previews/success-animation' },
  { name: 'Trang Đăng Ký Mẫu', href: '/previews/trang-dang-ky-mau' },
  { name: 'Trang Đăng Nhập Mẫu', href: '/previews/trang-dang-nhap-mau' },
  { name: 'Trang Nghệ Sĩ', href: '/previews/trang-nghe-si' },
  { name: 'Trang Quản Trị Hệ Thống', href: '/previews/trang-quan-tri-he-thong' },
  { name: 'Trang Quản Trị Nhãn', href: '/previews/trang-quan-tri-nhan' },
];

export default function PreviewsPage() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
        Component Previews
      </h1>
      <ul className="space-y-3">
        {previews.map((preview) => (
          <li key={preview.href}>
            <Link
              href={preview.href}
              className="block w-full text-left bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-3 px-5 rounded-lg transition-colors duration-200"
            >
              {preview.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}