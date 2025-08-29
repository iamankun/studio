# Hướng dẫn Migration sang Prisma Schema

## Tổng quan
Dự án An Kun Studio đã được migration hoàn toàn sang sử dụng Prisma Schema thay vì legacy types.

## Các thay đổi chính

### 1. Types mới
- **Prisma Types**: `/types/prisma.ts` - Chứa tất cả types được generate từ Prisma schema
- **Legacy Types**: `/types/submission.ts` - Giữ lại cho backward compatibility

### 2. Database Schema
- **File**: `/prisma/schema.prisma`
- **Models chính**: User, Submission, Track, Label, Profile, Video, File
- **Enums**: UserRole, SubmissionStatus, ReleaseType, ContributorRole, ApprovalType, FileCategory

### 3. Field Name Changes
| Legacy | Prisma | Mô tả |
|--------|--------|-------|
| `isrc` | `ISRC` | Uppercase theo chuẩn |
| `artistFullName` | `name` | Tên đầy đủ nghệ sĩ |
| `userId` | `creatorUID` | ID người tạo |
| `signedDocumentPath` | Removed | Chuyển sang SignatureDocument model |

### 4. API Endpoints đã cập nhật
- `/api/submissions/with-tracks` - Sử dụng Prisma transaction
- Các endpoints khác sẽ được cập nhật dần

## Cách sử dụng

### 1. Setup Database
```bash
npm run setup-prisma
```

### 2. Development
```bash
npm run db:push    # Push schema changes
npm run db:studio  # Open Prisma Studio
```

### 3. Production
```bash
npm run db:migrate # Create migration files
```

## Import Types

### Prisma Types (Khuyến nghị)
```typescript
import {
  PrismaUser,
  PrismaSubmission,
  PrismaTrack,
  UserRole,
  SubmissionStatus,
  ReleaseType
} from "@/types/prisma"
```

### Legacy Types (Backward compatibility)
```typescript
import {
  Submission,
  AdditionalArtist,
  MainCategory,
  SubCategory
} from "@/types/submission"
```

## Migration Checklist

### ✅ Hoàn thành
- [x] Tạo Prisma schema
- [x] Cập nhật types
- [x] Cập nhật upload-form-view.tsx
- [x] Cập nhật database-api-service.ts
- [x] Cập nhật API submissions/with-tracks
- [x] Thêm Prisma client setup

### 🔄 Đang thực hiện
- [ ] Cập nhật tất cả API endpoints
- [ ] Cập nhật components sử dụng legacy types
- [ ] Migration data từ legacy format

### 📋 Cần làm
- [ ] Tạo migration scripts cho production
- [ ] Cập nhật documentation
- [ ] Testing toàn diện

## Lưu ý quan trọng

1. **Backward Compatibility**: Legacy types vẫn được giữ lại để đảm bảo code cũ hoạt động
2. **Field Names**: Sử dụng field names mới theo Prisma schema
3. **Database Connection**: Đảm bảo DATABASE_URL được cấu hình đúng
4. **Type Safety**: Sử dụng Prisma types để có type safety tốt hơn

## Troubleshooting

### Lỗi Prisma Client
```bash
npx prisma generate
```

### Lỗi Database Connection
Kiểm tra DATABASE_URL trong `.env.local`

### Lỗi Type Mismatch
Đảm bảo import đúng types từ `/types/prisma.ts`

---

**Tác giả**: An Kun Studio Digital Music Distribution  
**Cập nhật**: 2025-01-18