// This file is auto-generated based on usage in other files.
// Some types are simplified.

export enum SubmissionStatus {
  PENDING = "Đang chờ",
  APPROVED = "Đã phê duyệt",
  REJECTED = "Đã từ chối",
  PUBLISHED = "Đã xuất bản",
  CANCELLED = "Đã hủy",
  PROCESSING = "Đang xử lý",
  DRAFT = "Bản nháp",
}

export interface Submission {
  id: {
    title: string;
    artist: string;
    UPC: string;
    type: string;
    coverImagePath?: string;
    releaseDate?: string;
    status: SubmissionStatus;
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
      status: SubmissionStatus.PENDING,
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
export function convertLegacySubmissionToPrisma(submission: Submission): { submission: Omit<PrismaSubmission, 'id' | 'createdAt' | 'updatedAt'>; tracks: any[] } {
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
  distributionPlatforms?: any;
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