// Generated types from Prisma schema
// Tác giả: An Kun Studio Digital Music Distribution

// Enums from Prisma schema
export enum UserRole {
  COMPOSER = "COMPOSER",
  PRODUCER = "PRODUCER", 
  PERFORMER = "PERFORMER",
  LABEL_MANAGER = "LABEL_MANAGER",
  ADMINISTRATOR = "ADMINISTRATOR"
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  DRAFT = "DRAFT"
}

export enum ReleaseType {
  SINGLE = "SINGLE",
  EP = "EP",
  ALBUM = "ALBUM",
  COMPILATION = "COMPILATION"
}

export enum ContributorRole {
  COMPOSER = "COMPOSER",
  LYRICIST = "LYRICIST",
  SINGERSONGWRITER = "SINGERSONGWRITER",
  PRODUCER = "PRODUCER",
  PERFORMER = "PERFORMER",
  VOCALIST = "VOCALIST",
  RAPPER = "RAPPER"
}

export enum ApprovalType {
  DSP = "DSP",
  CONTENT_ID = "CONTENT_ID",
  ACR_CLOUD = "ACR_CLOUD",
  LABEL_REVIEW = "LABEL_REVIEW"
}

export enum FileCategory {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  OTHER = "OTHER"
}

// Core Prisma types
export interface PrismaUser {
  UID: string
  userName: string
  email: string
  fullName?: string | null
  password: string
  roles: UserRole[]
  createdAt: Date
  updatedAt: Date
  profile?: PrismaProfile | null
  labelId?: string | null
}

export interface PrismaProfile {
  id: string
  bio?: string | null
  avatarUrl?: string | null
  phone?: string | null
  artist?: string | null
  name?: string | null
  verified: boolean
  userUID: string
  createdAt: Date
  updatedAt: Date
  socialLinks: string[]
}

export interface PrismaLabel {
  id: string
  name: string
  code: string
  ownerUID: string
  createdAt: Date
  updatedAt: Date
}

export interface PrismaSubmission {
  id: string
  title: string
  artist: string
  UPC?: string | null
  type: ReleaseType
  coverImagePath: string
  releaseDate: Date
  status: SubmissionStatus
  metadataLocked: boolean
  published: boolean
  albumName?: string | null
  mainCategory?: string | null
  subCategory?: string | null
  platforms?: any | null
  distributionLink?: string | null
  distributionPlatforms?: any | null
  statusVietnamese?: string | null
  rejectionReason?: string | null
  notes?: string | null
  labelId: string
  creatorUID: string
  createdAt: Date
  updatedAt: Date
}

export interface PrismaTrack {
  id: string
  title: string
  artist: string
  filePath: string
  duration: number
  ISRC: string
  IPI?: string | null
  ISWC?: string | null
  fileName?: string | null
  name?: string | null
  fileSize?: number | null
  format?: string | null
  bitrate?: string | null
  sampleRate?: string | null
  mainCategory?: string | null
  subCategory?: string | null
  lyrics?: string | null
  submissionId: string
  createdAt: Date
  updatedAt: Date
}

export interface PrismaVideo {
  id: string
  title: string
  artist: string
  youtubeVideoId?: string | null
  youtubeUrl?: string | null
  thumbnailUrl?: string | null
  duration?: number | null
  description?: string | null
  tags?: string | null
  category?: string | null
  language?: string | null
  contentIdEnabled: boolean
  contentIdStatus?: string | null
  creatorUID: string
  labelId: string
  submissionId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PrismaFile {
  id: string
  name: string
  path: string
  mimetype: string
  size: number
  category: FileCategory
  folderId?: string | null
  labelId?: string | null
  userUID?: string | null
  createdAt: Date
  updatedAt: Date
}

// Helper functions
export function getStatusColor(status: SubmissionStatus): string {
  switch (status) {
    case SubmissionStatus.PENDING: return "#facc15";
    case SubmissionStatus.APPROVED: return "#22c55e";
    case SubmissionStatus.REJECTED: return "#ef4444";
    case SubmissionStatus.PROCESSING: return "#38bdf8";
    case SubmissionStatus.PUBLISHED: return "#10b981";
    case SubmissionStatus.CANCELLED: return "#a3a3a3";
    case SubmissionStatus.DRAFT: return "#e5e7eb";
    default: return "#d1d5db";
  }
}

export function getStatusText(status: SubmissionStatus): string {
  switch (status) {
    case SubmissionStatus.PENDING: return "Đang chờ";
    case SubmissionStatus.APPROVED: return "Đã phê duyệt";
    case SubmissionStatus.REJECTED: return "Đã từ chối";
    case SubmissionStatus.PROCESSING: return "Đang xử lý";
    case SubmissionStatus.PUBLISHED: return "Đã xuất bản";
    case SubmissionStatus.CANCELLED: return "Đã hủy";
    case SubmissionStatus.DRAFT: return "Bản nháp";
    default: return "Không xác định";
  }
}

// Legacy compatibility
export const PrismaReleaseType = ReleaseType;
export const PrismaSubmissionStatus = SubmissionStatus;