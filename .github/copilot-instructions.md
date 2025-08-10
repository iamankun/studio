# An Kun Studio - Hướng dẫn cho AI Agent

## 🎵 Tổng quan Dự án
Đây là **An Kun Studio** v2.0.0 - nền tảng phân phối nhạc số chuyên nghiệp cho các label và nghệ sĩ độc lập, được xây dựng với Next.js 15, TypeScript, Prisma và PostgreSQL.

## 🏗️ Kiến trúc & Các Pattern Chính

### Cơ sở dữ liệu & Xác thực
- **Database**: PostgreSQL qua Neon (production) với Prisma ORM
- **Schema**: Thiết kế quan hệ đa bảng (`User`, `Label`, `Profile`, `Submission`, `Track`, v.v.)
- **Auth**: Iron Session + Basic Auth với phân quyền theo vai trò (`Label Manager`, `Artist`)
- **Authorization**: Pattern service layer trong `lib/authorization-service.ts` với UI components trong `components/authorized-component.tsx`

### Kiến trúc UI (shadcn/ui + Radix)
- **Components**: Tất cả UI components sử dụng Radix primitives với Tailwind CSS qua `components/ui/`
- **Styling**: Hệ thống CSS variables tùy chỉnh với hỗ trợ theme (dark/light mode)
- **Layout**: Layout dựa trên sidebar với `components/ui/sidebar.tsx` (hệ thống responsive phức tạp)
- **Icons**: Lucide React + FontAwesome (legacy components trong `components/awesome/`)

### Các Pattern Luồng Dữ liệu
- **API Routes**: RESTful endpoints trong `app/api/` với middleware phân quyền theo vai trò
- **Client State**: Pattern React hooks với custom hooks trong `hooks/` (không sử dụng external state management)
- **File Handling**: Multi-part uploads đến `public/uploads/` với lưu trữ phân loại
- **Logging**: Hệ thống logging toàn diện qua `lib/logger.ts` và `lib/api-activity-log.ts`

## 🛠️ Quy trình Phát triển

### Các Lệnh Thiết yếu
```bash
# Development (với Turbopack)
npm run dev

# Kiểm tra môi trường (chạy trước khi development)
npm run validate-env

# Các thao tác database
npm run generate  # Tạo dữ liệu mẫu
npm run migrate:db  # Database migrations

# Testing toàn diện
npm run test:complete  # Full integration tests
npm run debug:auth  # Kiểm tra authorization
npm run debug:db  # Kiểm tra kết nối database

# Build & deployment
npm run build  # Production build cho cPanel/VNPT hosting
```

### Các Script Chính để Debug
Dự án có **25+ debug scripts** trong thư mục `scripts/`:
- `kiem-tra-*` (tiếng Việt): Kiểm tra sức khỏe hệ thống
- `test-*`: API và integration testing
- `debug:*` npm scripts: Công cụ chẩn đoán nhanh
- Chạy `node scripts/kiem-tra-quan-ly.js` cho bộ test interactive

### Yêu cầu Môi trường
Các biến `.env.local` quan trọng:
```env
DATABASE_URL=postgresql://...  # Neon PostgreSQL
ADMIN_USERNAME=ankunstudio     # Tài khoản label manager
ADMIN_PASSWORD=@iamAnKun       # Mật khẩu mạnh
NEXTAUTH_SECRET=...            # Bảo mật session
SMTP_HOST/USER/PASS=...        # Hệ thống email
```

## 🔧 Quy ước Riêng của Dự án

### Tổ chức File
- **Đặt tên tiếng Việt**: Nhiều file sử dụng tên tiếng Việt (ví dụ: `kiem-tra-`, `tao-`, `sua-loi-`)
- **Cấu trúc Component**: Nhóm logic dưới `components/` với thư mục theo tính năng
- **Tài liệu**: Tài liệu phong phú trong `docs/` với nội dung tiếng Việt và tiếng Anh
- **Scripts**: Tất cả automation trong `scripts/` với utilities trong `scripts/utils/`

### Các Pattern Code
- **Error Boundaries**: Xử lý lỗi toàn diện với `components/error-boundary.tsx`
- **Loading States**: Pattern loading nhất quán với `components/loading-screen.tsx`
- **Responsive Design**: Mobile-first với hook `useIsMobile` cho responsive components
- **Type Safety**: TypeScript nghiêm ngặt với custom types trong thư mục `types/`

### Các Pattern Database
- **Hỗ trợ Multi-DB**: `lib/multi-database-service.ts` trừu tượng hóa các thao tác database
- **Tính toàn vẹn Quan hệ**: Quan hệ foreign key với cascade operations
- **Activity Logging**: Tất cả hành động người dùng được ghi log qua bảng `nhatKy` (activity log)
- **File Associations**: Quan hệ file-to-entity mạnh mẽ cho uploads

## ⚡ Bắt đầu Nhanh cho AI Agents

### Hiểu Hệ thống
1. **Kiểm tra Sức khỏe Hệ thống**: `npm run verify-system`
2. **Xem Thay đổi Gần đây**: Đọc `docs/MORNING_UPDATES_08_08_2025.md`
3. **Tổng quan Kiến trúc**: Nghiên cứu `docs/README.md` và `docs/debug-guide.md`

### Thực hiện Thay đổi
1. **Thay đổi Database**: Cập nhật `prisma/schema.prisma` → chạy migrations
2. **UI Components**: Tuân theo patterns shadcn/ui trong `components/ui/`
3. **API Endpoints**: Tạo trong `app/api/` với authorization middleware phù hợp
4. **Testing**: Sử dụng các test scripts phong phú của dự án trước khi commit

### Các Tác vụ Thường gặp
- **Thêm Tính năng**: Bắt đầu với database schema, sau đó API routes, rồi UI components
- **Debug Issues**: Sử dụng scripts `npm run debug:*` cho các subsystem cụ thể
- **Authorization**: Luôn kiểm tra quyền role qua `lib/authorization-service.ts`
- **File Handling**: Tuân theo patterns trong `components/upload-form-view.tsx`

## 🚨 Những Điều Quan trọng Cần Lưu ý
- **Sẵn sàng Production**: Đây là hệ thống production được deploy trên cPanel/VNPT hosting
- **Bảo mật theo Role**: Không bao giờ bỏ qua kiểm tra authorization trong APIs
- **Kết hợp Việt/Anh**: Tôn trọng patterns đặt tên hiện tại trong file naming
- **Tính toàn vẹn Database**: Luôn sử dụng transactions cho các thao tác liên quan
- **Tùy theo Môi trường**: Kiểm tra `APP_CONFIG.MODE` cho hành vi specific theo deployment

## 📚 Các File Tài liệu Quan trọng
- `docs/debug-guide.md` - Hướng dẫn debugging toàn diện
- `docs/authorization-test.md` - Quy trình testing bảo mật  
- `scripts/README.md` - Tất cả automation scripts có sẵn
- `docs/PROJECT_ANALYSIS_AND_FIXES.md` - Các sửa lỗi và cải tiến gần đây
