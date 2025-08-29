// Đồng bộ với schema.prisma
export enum PrismaSubmissionStatus {
  PENDING = "Đang chờ",
  APPROVED = "Đã phê duyệt",
  REJECTED = "Đã từ chối",
  PROCESSING = "Đang xử lý",
  PUBLISHED = "Đã xuất bản",
  CANCELLED = "Đã hủy",
  DRAFT = "Bản nháp",
}
// Đồng bộ với schema.prisma
export enum PrismaReleaseType {
  SINGLE = "SINGLE",
  EP = "EP",
  ALBUM = "ALBUM",
  COMPILATION = "COMPILATION",
}
// This file is auto-generated based on usage in other files.
// Some types are simplified.

// Đã có enum SubmissionStatus tiếng Anh phía trên, loại bỏ bản tiếng Việt để tránh trùng lặp

export interface Submission {
  id: {
    title: string;
    artist: string;
    UPC: string;
    type: string;
    coverImagePath?: string;
    releaseDate?: string;
    status: PrismaSubmissionStatus;
    metadataLocked: string;
    filePath?: string;
    published?: string;
    mainCategory?: string;
    subCategory?: string;
    platforms: string;
    distributionLink?: string;
    distributionPlatforms: string;
  }
}

// Fix: add missing semicolon between properties
export interface VideoInfo { id: string;[key: string]: unknown; }
export interface ContributorInfo { [key: string]: unknown; }
export interface FileInfo { id: string;[key: string]: unknown; }
export interface FolderInfo { id: string;[key: string]: unknown; }

// Fix: define PrismaSubmission fields with correct types
export interface PrismaSubmission {
  id: string;
  title: string;
  artist?: string;
  UPC?: string;
  type?: string;
  coverImagePath?: string;
  releaseDate?: string;
  metadataLocked?: string;
  filePath?: string;
  published?: string;
  mainCategory?: string;
  subCategory?: string;
  platforms?: string;
  distributionLink?: string;
  distributionPlatforms?: string;
  [key: string]: unknown;
}
export interface PrismaTrack { id: string; submissionId: string; title: string;[key: string]: unknown; }

// Dummy implementation to satisfy imports in database-api-service.ts
export function convertPrismaSubmissionToLegacy(submission: PrismaSubmission): Submission {
  return {
    id: {
      title: typeof submission.title === 'string' ? submission.title : '',
      artist: typeof submission.artist === 'string' ? submission.artist : 'Chờ nhập',
      UPC: typeof submission.UPC === 'string' ? submission.UPC : '',
      type: typeof submission.type === 'string' ? submission.type : '',
      coverImagePath: typeof submission.coverImagePath === 'string' ? submission.coverImagePath : undefined,
      releaseDate: typeof submission.releaseDate === 'string' ? submission.releaseDate : undefined,
      status: PrismaSubmissionStatus.PENDING,
      metadataLocked: typeof submission.metadataLocked === 'string' ? submission.metadataLocked : '',
      filePath: typeof submission.filePath === 'string' ? submission.filePath : undefined,
      published: typeof submission.published === 'string' ? submission.published : undefined,
      mainCategory: typeof submission.mainCategory === 'string' ? submission.mainCategory : undefined,
      subCategory: typeof submission.subCategory === 'string' ? submission.subCategory : undefined,
      platforms: typeof submission.platforms === 'string' ? submission.platforms : '',
      distributionLink: typeof submission.distributionLink === 'string' ? submission.distributionLink : undefined,
      distributionPlatforms: typeof submission.distributionPlatforms === 'string' ? submission.distributionPlatforms : '',
    }
  };
}

// Dummy implementation to satisfy imports in database-api-service.ts
export function convertLegacySubmissionToPrisma(submission: Submission): { submission: Omit<PrismaSubmission, 'id' | 'createdAt' | 'updatedAt'>; tracks: unknown[] } {
  const { title } = submission.id;
  const rest = { ...submission, id: { ...submission.id } };
  return {
    submission: {
      ...rest,
      track: {
        title,
      },
    },
    tracks: []
  };
}

export function toSubmission(submission: Submission): {
  id?: string;
  title?: string;
  artist?: string;
  UPC?: string;
  type?: string;
  coverImagePath?: string;
  releaseDate?: string;
  status?: string;
  metadataLocked?: string;
  published?: string;
  albumName?: string;
  mainCategory?: string;
  subCategory?: string;
  platforms?: string;
  distributionLink?: string;
  distributionPlatforms?: unknown;
} {
  // Dummy implementation: just map fields from submission.id and submission itself
  return {
    id: submission.id?.title,
    title: submission.id?.title,
    artist: submission.id?.artist,
    UPC: submission.id?.UPC,
    type: submission.id?.type,
    coverImagePath: submission.id?.coverImagePath,
    releaseDate: submission.id?.releaseDate,
    status: submission.id?.status,
    metadataLocked: submission.id?.metadataLocked,
    published: submission.id?.published,
    albumName: undefined,
    mainCategory: submission.id?.mainCategory,
    subCategory: submission.id?.subCategory,
    platforms: submission.id?.platforms,
    distributionLink: submission.id?.distributionLink,
    distributionPlatforms: submission.id?.distributionPlatforms,
  };
}

export interface SimpleSubmission {
  id: string;
  title: string;
  // Add more fields if needed
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  published: number;
  cancelled: number;
  userRole?: "Administrator" | "Label Manager" | "Artist" | "Producer" | "Lyricist" | "Composer" | "Singer-Songwriter" | "Vocalist" | "Performer" | "Rapper";
  canViewAll?: boolean;
  totalArtists?: number;
  Submissions?: SimpleSubmission[];
  artist?: string;
}

export type Submissions = Submission[];

export function getStatusColor(status: PrismaSubmissionStatus): string {
  switch (status) {
    case PrismaSubmissionStatus.PENDING: return "#facc15"; // vàng
    case PrismaSubmissionStatus.APPROVED: return "#22c55e"; // xanh lá
    case PrismaSubmissionStatus.REJECTED: return "#ef4444"; // đỏ
    case PrismaSubmissionStatus.PROCESSING: return "#38bdf8"; // xanh dương
    case PrismaSubmissionStatus.PUBLISHED: return "#10b981"; // xanh ngọc
    case PrismaSubmissionStatus.CANCELLED: return "#a3a3a3"; // xám
    case PrismaSubmissionStatus.DRAFT: return "#e5e7eb"; // xám nhạt
    default: return "#d1d5db"; // mặc định xám
  }
}

export function getStatusText(status: PrismaSubmissionStatus): string {
  switch (status) {
    case PrismaSubmissionStatus.PENDING: return "Đang chờ";
    case PrismaSubmissionStatus.APPROVED: return "Đã phê duyệt";
    case PrismaSubmissionStatus.REJECTED: return "Đã từ chối";
    case PrismaSubmissionStatus.PROCESSING: return "Đang xử lý";
    case PrismaSubmissionStatus.PUBLISHED: return "Đã xuất bản";
    case PrismaSubmissionStatus.CANCELLED: return "Đã hủy";
    case PrismaSubmissionStatus.DRAFT: return "Bản nháp";
    default: return "Không xác định";
  }
}

// Convert Submission to SimpleSubmission
export function toSimpleSubmission(submission: Submission): SimpleSubmission {
  return {
    id: submission.id?.title || '',
    title: submission.id?.title || 'Untitled'
  };
}