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

export type ReleaseType = "single" | "ep" | "lp" | "album" | "compilation"

export type MainCategory = "pop" | "singer-songwriter" | "hiphoprap" | "edm" | "rnb" | "ballad" | "acoustic" | "indie" | "other_main"
export type SubCategory = "official" | "cover" | "vpop" | "lofi" | "chill" | "trap" | "house" | "alternative" | "folk" | "other_sub"

export type CopyrightOwnershipStatus = "yes" | "no"
export type ReleaseHistoryStatus = "yes" | "no"
export type LyricsStatus = "yes" | "no"

export type Platform = "youtube" | "spotify" | "apple_music" | "soundcloud" | "other_platform"

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
