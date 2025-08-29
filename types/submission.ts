export enum SubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  DRAFT = "DRAFT"
}

export interface Submission {
  id: string
  title: string
  artist: string
  status: SubmissionStatus
  createdAt: Date
  updatedAt: Date
}

export interface SimpleSubmission {
  id: string
  title: string
}

export function toSimpleSubmission(submission: Submission): SimpleSubmission {
  return {
    id: submission.id,
    title: submission.title
  }
}

export enum ReleaseType {
  SINGLE = "SINGLE",
  EP = "EP",
  ALBUM = "ALBUM",
  COMPILATION = "COMPILATION"
}

export const PrismaReleaseType = ReleaseType;
export const PrismaSubmissionStatus = SubmissionStatus;

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

export function convertLegacySubmissionToPrisma(submission: any): any {
  return { submission: {}, tracks: [] };
}