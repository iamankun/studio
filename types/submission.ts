// Legacy submission interface for backward compatibility
export interface Submission {
  id: string
  userId: string
  isrc: string
  uploaderUsername: string
  artistName: string
  songTitle: string
  albumName?: string
  userEmail: string
  imageFile: string
  imageUrl: string
  audioUrl?: string
  audioUrls?: string[]
  audioFilesCount: number
  status: string
  submissionDate: string
  mainCategory: string
  subCategory?: string
  releaseType: string
  isCopyrightOwner: string
  hasBeenReleased: string
  platforms: string[]
  hasLyrics: string
  lyrics: string
  releaseDate: string
  artistRole: string
  fullName: string
  additionalArtists: AdditionalArtist[]
  trackInfos?: any[]
}

export interface SimpleSubmission {
  id: string
  title: string
}

export function toSimpleSubmission(submission: Submission): SimpleSubmission {
  return {
    id: submission.id,
    title: submission.songTitle
  }
}

// Form types for upload form
export interface AdditionalArtist {
  name: string
  fullName: string
  role: AdditionalArtistRole
  percentage: number
}

export type MainCategory = "pop" | "singer-songwriter" | "hiphoprap" | "edm" | "rnb" | "ballad" | "acoustic" | "indie" | "other_main"
export type SubCategory = "official" | "cover" | "vpop" | "lofi" | "chill" | "trap" | "house" | "alternative" | "folk" | "other_sub"
export type ReleaseType = "single" | "ep" | "album" | "compilation"
export type CopyrightOwnershipStatus = "yes" | "no"
export type ReleaseHistoryStatus = "yes" | "no"
export type LyricsStatus = "yes" | "no"
export type Platform = "youtube" | "spotify" | "apple_music" | "soundcloud" | "other_platform"
export type ArtistPrimaryRole = "singer" | "singer-songwriter" | "rapper" | "producer" | "composer" | "songwriter" | "instrumental"
export type AdditionalArtistRole = "featuring" | "vocalist" | "rapper" | "producer" | "composer" | "songwriter" | "instrumental"

// Video and File types
export interface VideoInfo {
  id: string
  title: string
  artist: string
  youtubeVideoId?: string
  youtubeUrl?: string
  thumbnailUrl?: string
  duration?: number
  description?: string
  tags?: string
  category?: string
  language?: string
  contentIdEnabled: boolean
  contentIdStatus?: string
  createdAt: Date
  updatedAt: Date
}

export interface FileInfo {
  id: string
  name: string
  path: string
  mimetype: string
  size: number
  category: string
  folderId?: string
  createdAt: Date
  updatedAt: Date
}

export interface FolderInfo {
  id: string
  name: string
  path: string
  parentId?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}