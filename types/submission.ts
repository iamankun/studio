export type ArtistPrimaryRole =
  | "singer"
  | "singer-songwriter" 
  | "rapper"
  | "producer"
  | "composer"
  | "songwriter"
  | "instrumental"

export type AdditionalArtistRole =
  | "featuring"
  | "vocalist"
  | "rapper"
  | "producer"
  | "composer"
  | "songwriter"
  | "instrumental"

// ==================== PRISMA-COMPATIBLE ENUMS ====================
// These match the Prisma schema exactly

export enum PrismaUserRole {
  ARTIST = "ARTIST",
  COMPOSER = "COMPOSER", 
  PRODUCER = "PRODUCER",
  PERFORMER = "PERFORMER",
  LABEL_MANAGER = "LABEL_MANAGER",
  ADMINISTRATOR = "ADMINISTRATOR"
}

export enum PrismaSubmissionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED", 
  REJECTED = "REJECTED",
  PROCESSING = "PROCESSING",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  DRAFT = "DRAFT"
}

export enum PrismaReleaseType {
  SINGLE = "SINGLE",
  EP = "EP",
  ALBUM = "ALBUM", 
  COMPILATION = "COMPILATION"
}

export enum PrismaContributorRole {
  COMPOSER = "COMPOSER",
  LYRICIST = "LYRICIST",
  PRODUCER = "PRODUCER",
  PERFORMER = "PERFORMER",
  VOCALIST = "VOCALIST",
  RAPPER = "RAPPER"
}

export enum PrismaApprovalType {
  DSP = "DSP",
  CONTENT_ID = "CONTENT_ID",
  ACR_CLOUD = "ACR_CLOUD",
  LABEL_REVIEW = "LABEL_REVIEW"
}

export enum PrismaFileCategory {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  OTHER = "OTHER"
}

// ==================== LEGACY TYPES (DEPRECATED) ====================
// Keep for backward compatibility but mark as deprecated

/** @deprecated Use PrismaReleaseType instead */
export type ReleaseType = "single" | "ep" | "lp" | "album" | "compilation"

/** @deprecated Use appropriate category system instead */
export type MainCategory = "pop" | "singer-songwriter" | "hiphoprap" | "edm" | "rnb" | "ballad" | "acoustic" | "indie" | "other_main"
/** @deprecated Use appropriate category system instead */
export type SubCategory = "official" | "cover" | "vpop" | "lofi" | "chill" | "trap" | "house" | "alternative" | "folk" | "other_sub"

/** @deprecated Use boolean fields instead */
export type CopyrightOwnershipStatus = "yes" | "no"
/** @deprecated Use boolean fields instead */
export type ReleaseHistoryStatus = "yes" | "no"
/** @deprecated Use boolean fields instead */
export type LyricsStatus = "yes" | "no"

/** @deprecated Use platform-specific fields instead */
export type Platform = "youtube" | "spotify" | "apple_music" | "soundcloud" | "other_platform"

/** @deprecated Use PrismaSubmissionStatus instead */
export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "processing"
  | "published"
  | "cancelled"
  | "draft"
  | "Đã nhận, đang chờ duyệt"
  | "Đã duyệt, từ chối phát hành"
  | "Đã duyệt, đang chờ phát hành!"
  | "Đã phát hành, đang chờ ra mắt"
  | "Hoàn thành phát hành!"
  | "Đã hủy"
  | "Bản nháp"

// ==================== PRISMA-COMPATIBLE INTERFACES ====================
// These match the Prisma schema exactly

export interface PrismaUser {
  id: string
  email: string
  name: string | null
  password: string
  roles: PrismaUserRole[]
  createdAt: Date
  updatedAt: Date
  labelId: string | null
}

export interface PrismaProfile {
  id: string
  bio: string | null
  avatarUrl: string | null
  phone: string | null
  artistName: string | null
  fullName: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  youtubeUrl: string | null
  spotifyUrl: string | null
  appleMusicUrl: string | null
  soundcloudUrl: string | null
  userId: string
  socialLinks: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

export interface PrismaLabel {
  id: string
  name: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface PrismaSubmission {
  id: string
  title: string
  artist: string
  upc: string | null
  type: PrismaReleaseType
  coverImagePath: string
  releaseDate: Date
  status: PrismaSubmissionStatus
  metadataLocked: boolean
  published: boolean
  albumName: string | null
  mainCategory: string | null
  subCategory: string | null
  platforms: Record<string, unknown> | null
  distributionLink: string | null
  distributionPlatforms: Record<string, unknown> | null
  statusVietnamese: string | null
  rejectionReason: string | null
  notes: string | null
  userId: string
  labelId: string
  createdAt: Date
  updatedAt: Date
}

export interface PrismaTrack {
  id: string
  title: string
  artist: string
  filePath: string
  duration: number
  isrc: string | null
  fileName: string | null
  artistFullName: string | null
  fileSize: number | null
  format: string | null
  bitrate: string | null
  sampleRate: string | null
  submissionId: string
  createdAt: Date
  updatedAt: Date
}

export interface PrismaVideo {
  id: string
  title: string
  artist: string
  youtubeVideoId: string | null
  youtubeUrl: string | null
  thumbnailUrl: string | null
  duration: number | null
  description: string | null
  tags: string | null
  category: string | null
  language: string | null
  contentIdEnabled: boolean
  contentIdStatus: string | null
  userId: string
  labelId: string
  submissionId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PrismaSubmissionContributor {
  id: string
  role: string
  percentage: number | null
  userId: string
  submissionId: string
  createdAt: Date
}

export interface PrismaTrackContributor {
  id: string
  role: PrismaContributorRole
  percentage: number | null
  userId: string
  trackId: string
  createdAt: Date
}

export interface PrismaVideoContributor {
  id: string
  role: string
  percentage: number | null
  userId: string
  videoId: string
  createdAt: Date
}

export interface PrismaSubmissionApproval {
  id: string
  type: PrismaApprovalType
  isApproved: boolean
  reason: string | null
  submissionId: string
  approverId: string
  createdAt: Date
}

export interface PrismaSubmissionComment {
  id: string
  content: string
  userId: string
  submissionId: string
  createdAt: Date
}

export interface PrismaFile {
  id: string
  name: string
  path: string
  mimetype: string
  size: number
  category: PrismaFileCategory
  folderId: string | null
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PrismaFileFolder {
  id: string
  name: string
  path: string
  parentId: string | null
  ownerId: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// ==================== LEGACY INTERFACES (DEPRECATED) ====================
// Keep for backward compatibility but mark as deprecated

/** @deprecated Use PrismaTrack instead */
export interface TrackInfo {
  id?: string
  fileName: string
  songTitle: string
  artistName: string
  artistFullName: string
  additionalArtists: AdditionalArtist[]
  isrc: string
  duration?: number
  fileSize?: number
  format?: string
  bitrate?: string
  sampleRate?: string
  filePath?: string
}

export interface AdditionalArtist {
  name: string
  fullName?: string
  role: AdditionalArtistRole
  percentage: number
}

export interface TextStyle {
  gradient: string
  animation: string
  font: string
}

/** @deprecated Use PrismaSubmission with related PrismaTrack[] instead */
export interface Submission {
  id: string
  isrc: string
  upc?: string
  uploaderUsername: string
  artistName: string
  songTitle: string
  albumName?: string
  userEmail: string
  imageFile: string
  imageUrl: string
  audioUrl?: string
  audioUrls?: string[]
  videoUrl?: string
  videoFile?: string
  audioFilesCount: number
  submissionDate: string
  status: SubmissionStatus
  mainCategory: MainCategory
  subCategory?: SubCategory
  releaseType: ReleaseType
  isCopyrightOwner: CopyrightOwnershipStatus
  hasBeenReleased: ReleaseHistoryStatus
  platforms: Platform[]
  hasLyrics: LyricsStatus
  lyrics?: string
  notes?: string
  fullName: string
  artistRole: ArtistPrimaryRole
  additionalArtists: AdditionalArtist[]
  trackInfos: TrackInfo[]
  releaseDate: string
  titleStyle?: TextStyle
  albumStyle?: TextStyle
  userId: string
  distributionLink?: string
  distributionPlatforms?: {
    platform: string;
    url: string;
    logo: string;
  }[]
  
  // Thêm các trường mới từ schema
  title?: string
  artist?: string
  coverImagePath?: string
  metadataLocked?: boolean
  published?: boolean
  statusVietnamese?: string
  rejectionReason?: string
  labelId?: string
  videos?: VideoInfo[]
  contributors?: ContributorInfo[]
  createdAt?: string
  updatedAt?: string
}

// Interface cho Video (CHỈ CẤP THÔNG TIN - theo MAU/)
export interface VideoInfo {
  id?: string
  title: string
  artist: string
  
  // CHỈ CẤP THÔNG TIN VIDEO - KHÔNG CẦN FILE VIDEO
  // Thông tin này dùng cho YouTube Content ID
  youtubeVideoId?: string   // ID video trên YouTube
  youtubeUrl?: string       // URL đầy đủ của video
  thumbnailUrl?: string     // URL thumbnail từ YouTube
  duration?: number         // Thời lượng (seconds)
  
  // Thông tin từ mẫu MAU/ để đăng ký Content ID
  description?: string      // Mô tả video
  tags?: string            // Tags, keywords
  category?: string        // Thể loại video
  language?: string        // Ngôn ngữ
  
  // Thông tin cho YouTube Content ID
  contentIdEnabled?: boolean
  contentIdStatus?: string  // Trạng thái đăng ký Content ID
  
  contributors?: VideoContributorInfo[]
}

// Thêm interface cho Contributors
export interface ContributorInfo {
  id?: string
  role: string
  percentage?: number
  userId: string
  userName?: string
  userEmail?: string
}

export interface VideoContributorInfo {
  id?: string
  role: string
  percentage?: number
  userId: string
  userName?: string
  userEmail?: string
}

// Additional interfaces for authorization system
export interface SimpleSubmission {
  id: string
  track_title: string
  artist_name: string
  artist_id?: string
  user_id?: string
  status: SubmissionStatus
  genre: string
  submission_date: string
  created_at?: string
  updated_at?: string
  cover_art_url?: string
  artwork_path?: string
  imageUrl?: string
  audio_file_url?: string
  file_path?: string
  audioUrl?: string
  release_date?: string
  upc?: string
  release_links?: string[]
  comment?: string
  rejection_reason?: string
  isrc_code?: string
  duration?: number
  file_size?: number
  language?: string
  explicit_content?: boolean
  mood_tags?: string[]
  instruments?: string[]
  bpm?: number
  key_signature?: string
  label?: string
  copyright?: string
  producer?: string
  composer?: string
  lyricist?: string
}

export interface SubmissionStats {
  total: number
  pending: number
  approved: number
  rejected: number
  published: number
  cancelled: number
  userRole: string
  canViewAll: boolean
  artistName?: string
  totalArtists?: number
  recentSubmissions?: SimpleSubmission[]
}

// Status color helper functions
export function getStatusColor(status: SubmissionStatus): string {
  switch (status) {
    case "Đã nhận, đang chờ duyệt":
      return "bg-yellow-600 text-yellow-100";
    case "Đã duyệt, từ chối phát hành":
      return "bg-red-600 text-red-100";
    case "Đã duyệt, đang chờ phát hành!":
      return "bg-blue-600 text-blue-100";
    case "Đã phát hành, đang chờ ra mắt":
      return "bg-purple-600 text-purple-100";
    case "Hoàn thành phát hành!":
      return "bg-green-600 text-green-100";
    case "pending":
      return "bg-yellow-600 text-yellow-100";
    case "approved":
      return "bg-blue-600 text-blue-100";
    case "rejected":
      return "bg-red-600 text-red-100";
    case "processing":
      return "bg-purple-600 text-purple-100";
    case "published":
      return "bg-green-600 text-green-100";
    case "draft":
      return "bg-gray-600 text-gray-100";
    default:
      return "bg-gray-600 text-gray-100";
  }
}

// Get a human-readable status text
export function getStatusText(status: SubmissionStatus): string {
  switch (status) {
    case "pending":
      return "Đã nhận, đang chờ duyệt";
    case "approved":
      return "Đã duyệt, đang chờ phát hành!";
    case "rejected":
      return "Đã duyệt, từ chối phát hành";
    case "processing":
      return "Đã phát hành, đang chờ ra mắt";
    case "published":
      return "Hoàn thành phát hành!";
    case "cancelled":
      return "Đã hủy";
    case "draft":
      return "Bản nháp";
    default:
      return status;
  }
}

// Thêm các interface cho File Explorer System
export interface FileInfo {
  id: string
  name: string
  path: string
  mimeType: string
  size: number
  category: FileCategory
  folderId?: string
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface FolderInfo {
  id: string
  name: string
  path: string
  parentId?: string
  ownerId?: string
  isPublic: boolean
  files?: FileInfo[]
  children?: FolderInfo[]
  createdAt: string
  updatedAt: string
}

export type FileCategory = "audio" | "video" | "image" | "document" | "other"

// Thêm interface cho Distribution Platforms
export interface DistributionPlatformInfo {
  id: string
  name: string
  logoUrl?: string
  apiEndpoint?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Helper function để convert Submission thành SimpleSubmission
export function toSimpleSubmission(submission: Submission): SimpleSubmission {
  return {
    id: submission.id,
    track_title: submission.songTitle,
    artist_name: submission.artistName,
    artist_id: submission.userId,
    user_id: submission.userId,
    status: submission.status,
    genre: submission.mainCategory,
    submission_date: submission.submissionDate,
    created_at: submission.createdAt,
    updated_at: submission.updatedAt,
    cover_art_url: submission.imageUrl,
    artwork_path: submission.imageFile,
    imageUrl: submission.imageUrl,
    audio_file_url: submission.audioUrl,
    file_path: submission.audioUrl,
    audioUrl: submission.audioUrl,
    release_date: submission.releaseDate,
    upc: submission.upc,
    rejection_reason: submission.rejectionReason,
    isrc_code: submission.isrc
  }
}

// Helper function để convert SimpleSubmission thành Submission (nếu cần)
export function fromSimpleSubmission(simple: SimpleSubmission, userId: string): Partial<Submission> {
  return {
    id: simple.id,
    songTitle: simple.track_title,
    artistName: simple.artist_name,
    userId: userId,
    status: simple.status,
    mainCategory: simple.genre as MainCategory,
    submissionDate: simple.submission_date,
    createdAt: simple.created_at,
    updatedAt: simple.updated_at,
    imageUrl: simple.imageUrl || simple.cover_art_url || '',
    imageFile: simple.artwork_path || '',
    audioUrl: simple.audioUrl || simple.audio_file_url,
    releaseDate: simple.release_date || '',
    upc: simple.upc,
    rejectionReason: simple.rejection_reason,
    isrc: simple.isrc_code || ''
  }
}

// ==================== PRISMA CONVERSION UTILITIES ====================
// Functions to convert between legacy flat structure and new relational structure

/**
 * Convert legacy Submission with trackInfos array to Prisma relational structure
 */
export function convertLegacySubmissionToPrisma(
  legacySubmission: Submission
): { submission: Omit<PrismaSubmission, 'createdAt' | 'updatedAt'>, tracks: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt' | 'submissionId'>[] } {
  // Convert legacy status to Prisma status
  const statusMap: Record<string, PrismaSubmissionStatus> = {
    'pending': PrismaSubmissionStatus.PENDING,
    'approved': PrismaSubmissionStatus.APPROVED,
    'rejected': PrismaSubmissionStatus.REJECTED,
    'processing': PrismaSubmissionStatus.PROCESSING,
    'published': PrismaSubmissionStatus.PUBLISHED,
    'cancelled': PrismaSubmissionStatus.CANCELLED,
    'draft': PrismaSubmissionStatus.DRAFT,
    'Đã nhận, đang chờ duyệt': PrismaSubmissionStatus.PENDING,
    'Đã duyệt, từ chối phát hành': PrismaSubmissionStatus.REJECTED,
    'Đã duyệt, đang chờ phát hành!': PrismaSubmissionStatus.APPROVED,
    'Đã phát hành, đang chờ ra mắt': PrismaSubmissionStatus.PROCESSING,
    'Hoàn thành phát hành!': PrismaSubmissionStatus.PUBLISHED,
    'Đã hủy': PrismaSubmissionStatus.CANCELLED,
    'Bản nháp': PrismaSubmissionStatus.DRAFT
  };

  // Convert legacy release type to Prisma release type
  const releaseTypeMap: Record<string, PrismaReleaseType> = {
    'single': PrismaReleaseType.SINGLE,
    'ep': PrismaReleaseType.EP,
    'lp': PrismaReleaseType.ALBUM,
    'album': PrismaReleaseType.ALBUM,
    'compilation': PrismaReleaseType.COMPILATION
  };

  const prismaSubmission: Omit<PrismaSubmission, 'createdAt' | 'updatedAt'> = {
    id: legacySubmission.id,
    title: legacySubmission.songTitle,
    artist: legacySubmission.artistName,
    upc: legacySubmission.upc || null,
    type: releaseTypeMap[legacySubmission.releaseType] || PrismaReleaseType.SINGLE,
    coverImagePath: legacySubmission.imageFile || legacySubmission.imageUrl,
    releaseDate: new Date(legacySubmission.releaseDate),
    status: statusMap[legacySubmission.status] || PrismaSubmissionStatus.PENDING,
    metadataLocked: legacySubmission.metadataLocked || false,
    published: legacySubmission.published || false,
    albumName: legacySubmission.albumName || null,
    mainCategory: legacySubmission.mainCategory || null,
    subCategory: legacySubmission.subCategory || null,
    platforms: legacySubmission.platforms ? { platforms: legacySubmission.platforms } : null,
    distributionLink: legacySubmission.distributionLink || null,
    distributionPlatforms: legacySubmission.distributionPlatforms ? { platforms: legacySubmission.distributionPlatforms } : null,
    statusVietnamese: legacySubmission.statusVietnamese || null,
    rejectionReason: legacySubmission.rejectionReason || null,
    notes: legacySubmission.notes || null,
    userId: legacySubmission.userId,
    labelId: legacySubmission.labelId || '' // This should be provided by the caller
  };

  const prismaTracks: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt' | 'submissionId'>[] = 
    legacySubmission.trackInfos?.map(trackInfo => ({
      title: trackInfo.songTitle,
      artist: trackInfo.artistName,
      filePath: trackInfo.filePath || '',
      duration: trackInfo.duration || 0,
      isrc: trackInfo.isrc || null,
      fileName: trackInfo.fileName || null,
      artistFullName: trackInfo.artistFullName || null,
      fileSize: trackInfo.fileSize || null,
      format: trackInfo.format || null,
      bitrate: trackInfo.bitrate || null,
      sampleRate: trackInfo.sampleRate || null
    })) || [];

  return { submission: prismaSubmission, tracks: prismaTracks };
}

/**
 * Convert Prisma relational structure back to legacy flat structure for backward compatibility
 */
export function convertPrismaSubmissionToLegacy(
  prismaSubmission: PrismaSubmission,
  prismaTracks: PrismaTrack[]
): Submission {
  // Convert Prisma status back to legacy status
  const statusMap: Record<PrismaSubmissionStatus, SubmissionStatus> = {
    [PrismaSubmissionStatus.PENDING]: 'Đã nhận, đang chờ duyệt',
    [PrismaSubmissionStatus.APPROVED]: 'Đã duyệt, đang chờ phát hành!',
    [PrismaSubmissionStatus.REJECTED]: 'Đã duyệt, từ chối phát hành',
    [PrismaSubmissionStatus.PROCESSING]: 'Đã phát hành, đang chờ ra mắt',
    [PrismaSubmissionStatus.PUBLISHED]: 'Hoàn thành phát hành!',
    [PrismaSubmissionStatus.CANCELLED]: 'Đã hủy',
    [PrismaSubmissionStatus.DRAFT]: 'Bản nháp'
  };

  // Convert Prisma release type back to legacy release type
  const releaseTypeMap: Record<PrismaReleaseType, ReleaseType> = {
    [PrismaReleaseType.SINGLE]: 'single',
    [PrismaReleaseType.EP]: 'ep',
    [PrismaReleaseType.ALBUM]: 'album',
    [PrismaReleaseType.COMPILATION]: 'compilation'
  };

  const trackInfos: TrackInfo[] = prismaTracks.map(track => ({
    id: track.id,
    fileName: track.fileName || '',
    songTitle: track.title,
    artistName: track.artist,
    artistFullName: track.artistFullName || '',
    additionalArtists: [], // This would need to be populated from contributors
    isrc: track.isrc || '',
    duration: track.duration,
    fileSize: track.fileSize || undefined,
    format: track.format || undefined,
    bitrate: track.bitrate || undefined,
    sampleRate: track.sampleRate || undefined,
    filePath: track.filePath
  }));

  const legacySubmission: Submission = {
    id: prismaSubmission.id,
    isrc: prismaTracks[0]?.isrc || '',
    upc: prismaSubmission.upc || undefined,
    uploaderUsername: '', // This would need to be populated from user data
    artistName: prismaSubmission.artist,
    songTitle: prismaSubmission.title,
    albumName: prismaSubmission.albumName || undefined,
    userEmail: '', // This would need to be populated from user data
    imageFile: prismaSubmission.coverImagePath,
    imageUrl: prismaSubmission.coverImagePath,
    audioUrl: prismaTracks[0]?.filePath || undefined,
    audioUrls: prismaTracks.map(track => track.filePath),
    videoUrl: undefined,
    videoFile: undefined,
    audioFilesCount: prismaTracks.length,
    submissionDate: prismaSubmission.createdAt.toISOString(),
    status: statusMap[prismaSubmission.status],
    mainCategory: (prismaSubmission.mainCategory as MainCategory) || 'other_main',
    subCategory: (prismaSubmission.subCategory as SubCategory) || undefined,
    releaseType: releaseTypeMap[prismaSubmission.type],
    isCopyrightOwner: 'yes', // Default value, should be determined from business logic
    hasBeenReleased: 'no', // Default value, should be determined from business logic
    platforms: [], // This would need to be extracted from platforms JSON
    hasLyrics: 'no', // Default value, should be determined from business logic
    lyrics: undefined,
    notes: prismaSubmission.notes || undefined,
    fullName: '', // This would need to be populated from user data
    artistRole: 'singer', // Default value, should be determined from business logic
    additionalArtists: [], // This would need to be populated from contributors
    trackInfos: trackInfos,
    releaseDate: prismaSubmission.releaseDate.toISOString(),
    titleStyle: undefined,
    albumStyle: undefined,
    userId: prismaSubmission.userId,
    distributionLink: prismaSubmission.distributionLink || undefined,
    distributionPlatforms: prismaSubmission.distributionPlatforms ? 
      (prismaSubmission.distributionPlatforms as { platforms?: { platform: string; url: string; logo: string; }[] }).platforms : 
      undefined,
    title: prismaSubmission.title,
    artist: prismaSubmission.artist,
    coverImagePath: prismaSubmission.coverImagePath,
    metadataLocked: prismaSubmission.metadataLocked,
    published: prismaSubmission.published,
    statusVietnamese: prismaSubmission.statusVietnamese || undefined,
    rejectionReason: prismaSubmission.rejectionReason || undefined,
    labelId: prismaSubmission.labelId,
    videos: [], // This would need to be populated from related videos
    contributors: [], // This would need to be populated from related contributors
    createdAt: prismaSubmission.createdAt.toISOString(),
    updatedAt: prismaSubmission.updatedAt.toISOString()
  };

  return legacySubmission;
}
