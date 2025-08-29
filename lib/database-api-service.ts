// File: lib/database-api-service.ts
// An Kun Studio Digital Music Distribution System
// Service thống nhất cho tất cả database operations - SỬ DỤNG API ENDPOINTS

import type { User } from "@/types/user"
import type {
  VideoInfo,
  FileInfo,
  FolderInfo,
  Submission
} from "@/types/submission"
import {
  PrismaSubmission,
  PrismaTrack,
} from "@/types/prisma"
import { logger } from "@/lib/logger"

export interface DatabaseResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  source?: string
}

export class DatabaseApiService {
  private readonly apiAvailable = true;

  constructor() {
    console.log('DatabaseApiService: Initialized (Production Only - API Based)')
  }

  // Helper function để chuẩn hóa submissions với file mặc định
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private normalizeSubmissions(submissions: unknown[]): any[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (submissions as any[]).map((submission: any) => {
      // Xử lý tên nghệ sĩ với logic Various Artist
      let processedArtistName = submission.artist_name ?? submission.artists ?? '';

      // Nếu không có tên nghệ sĩ hoặc rỗng
      if (!processedArtistName || processedArtistName.trim() === '') {
        processedArtistName = 'Various Artist';
      } else {
        // Kiểm tra nếu có nhiều hơn 3 nghệ sĩ (phân cách bằng dấu phẩy, &, hoặc feat)
        const artistSeparators = /[,&]|feat\.|featuring|ft\./gi;
        const artistCount = processedArtistName.split(artistSeparators).length;

        if (artistCount > 3) {
          processedArtistName = 'Various Artist';
        }
      }

      return {
        ...submission,
        // Nếu không có ảnh cover hoặc artwork, sử dụng ảnh mặc định
        cover_art_url: submission.cover_art_url ?? submission.artwork_path ?? '/dianhac.jpg',
        artwork_path: submission.artwork_path ?? submission.cover_art_url ?? '/dianhac.jpg',
        imageUrl: submission.imageUrl ?? submission.cover_art_url ?? submission.artwork_path ?? '/dianhac.jpg',

        // Nếu không có file audio, sử dụng file mặc định
        audio_file_url: submission.audio_file_url ?? submission.file_path ?? '/VNA2P25XXXXX.wav',
        file_path: submission.file_path ?? submission.audio_file_url ?? '/VNA2P25XXXXX.wav',
        audioUrl: submission.audioUrl ?? submission.audio_file_url ?? submission.file_path ?? '/VNA2P25XXXXX.wav',

        // Đảm bảo các trường bắt buộc với logic Various Artist
        track_title: submission.track_title ?? submission.title ?? 'Untitled Track',
        artist_name: processedArtistName,
        status: submission.status ?? 'pending',
        genre: submission.genre ?? 'Unknown',
        submission_date: submission.submission_date ?? submission.created_at ?? new Date().toISOString()
      }
    })
  }

  public async initialize() {
    // API-based service không cần initialize database connection
    console.log("✅ Database API Service initialized (API-based)");
  }

  // ==================== AUTHENTICATION METHODS ====================

  public async authenticateUser(username: string, password?: string): Promise<DatabaseResult<User>> {
    logger.info('DatabaseApiService: Authentication attempt', {
      component: 'DatabaseApiService',
      action: 'authenticateUser',
      data: { username }
    })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Authentication successful', {
          component: 'DatabaseApiService',
          action: 'authenticateUser',
          userId: result.user?.id
        })
        console.log(`✅ API authentication successful for ${result.user?.role}`);
        return { success: true, data: result.user, source: "API" };
      } else {
        logger.error('DatabaseApiService: Authentication failed', {
          component: 'DatabaseApiService',
          action: 'authenticateUser',
          error: result.message
        })
        return { success: false, message: result.message ?? 'Authentication failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Authentication error', {
        component: 'DatabaseApiService',
        action: 'authenticateUser',
        error: errorMessage
      })
      console.error("API auth failed:", error);
      return { success: false, message: "Authentication service unavailable.", error: errorMessage };
    }
  }

  public async createUser(userData: Partial<User>): Promise<DatabaseResult<User>> {
    const { userName, email, password, displayName } = userData;

    if (!userName || !email || !password || !displayName) {
      return { success: false, message: "Missing required fields for user creation." };
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, email, password, name: displayName })
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.user, source: "API" };
      } else {
        return { success: false, message: result.message ?? 'User creation failed' };
      }
    } catch (error) {
      console.error("API createUser failed:", error);
      return { success: false, message: "User creation service unavailable." };
    }
  }

  // ==================== ARTIST METHODS ====================

  public async getArtists(): Promise<DatabaseResult<User[]>> {
    try {
      const response = await fetch('/api/artists');
      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, data: [], message: result.error ?? "Failed to retrieve artists" };
      }
    } catch (error) {
      console.error('API: Failed to get artists:', error);
      return { success: false, data: [], message: "Artist service unavailable." };
    }
  }

  public async updateArtistProfile(id: string, profileData: Partial<User>): Promise<DatabaseResult<User>> {
    try {
      const response = await fetch(`/api/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: 'Artist', ...profileData })
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Artist profile update failed' };
      }
    } catch (error) {
      console.error('API: Failed to update artist profile:', error);
      return { success: false, message: "Artist profile update service unavailable." };
    }
  }

  public async updateLabelManagerProfile(id: string, profileData: Partial<User>): Promise<DatabaseResult<User>> {
    try {
      const response = await fetch(`/api/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: 'Label Manager', ...profileData })
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Label Manager profile update failed' };
      }
    } catch (error) {
      console.error('API: Failed to update label manager profile:', error);
      return { success: false, message: "Label Manager profile update service unavailable." };
    }
  }

  public async getUserAvatar(userId: string, type?: string): Promise<DatabaseResult<string>> {
    try {
      const queryParams = type ? `?type=${type}` : '';
      const response = await fetch(`/api/images/avatar/${userId}${queryParams}`);
      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Failed to get user avatar' };
      }
    } catch (error) {
      console.error('API: Failed to get user avatar:', error);
      return { success: false, message: "Avatar service unavailable." };
    }
  }

  public async updateUserAvatar(userId: string, avatarData: { file: File; artistName: string }): Promise<DatabaseResult<{ url: string; path: string }>> {
    try {
      const formData = new FormData();
      formData.append('file', avatarData.file);
      formData.append('artistName', avatarData.artistName);
      formData.append('userId', userId);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: { url: result.url, path: result.path }, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Failed to update user avatar' };
      }
    } catch (error) {
      console.error('API: Failed to update user avatar:', error);
      return { success: false, message: "Avatar update service unavailable." };
    }
  }

  // ==================== SUBMISSION METHODS ====================

  public async getSubmissions(username?: string): Promise<DatabaseResult<Submission[]>> {
    logger.info('DatabaseApiService: Getting submissions', {
      component: 'DatabaseApiService',
      action: 'getSubmissions',
      data: { username }
    })

    try {
      const queryParams = username ? `?username=${username}` : '';
      const response = await fetch(`/api/submissions${queryParams}`);
      const result = await response.json();

      if (result.success) {
        const normalized = this.normalizeSubmissions(result.data);
        return { success: true, data: normalized, source: 'API' };
      } else {
        return { success: false, data: [], message: result.error ?? "Failed to retrieve submissions" };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Get submissions error', {
        component: 'DatabaseApiService',
        action: 'getSubmissions',
        error: errorMessage
      })
      console.error('API: Failed to get submissions:', error);
      return { success: false, data: [], message: "Submission service unavailable.", error: errorMessage };
    }
  }

  public async getSubmissionById(id: string): Promise<DatabaseResult<Submission>> {
    try {
      const response = await fetch(`/api/submissions/${id}`);
      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Failed to get submission' };
      }
    } catch (error) {
      console.error('API: Failed to get submission by ID:', error);
      return { success: false, message: "Submission service unavailable." };
    }
  }

  public async createSubmission(submission: Omit<Submission, 'id'>): Promise<DatabaseResult<Submission>> {
    logger.info('DatabaseApiService: Creating submission', {
      component: 'DatabaseApiService',
      action: 'createSubmission'
    })

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Submission created', {
          component: 'DatabaseApiService',
          action: 'createSubmission',
          submissionId: result.data?.id
        })
        return { success: true, data: result.data, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Create submission failed', {
          component: 'DatabaseApiService',
          action: 'createSubmission',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Create submission failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Create submission error', {
        component: 'DatabaseApiService',
        action: 'createSubmission',
        error: errorMessage
      })
      return { success: false, message: "Create submission service unavailable.", error: errorMessage };
    }
  }

  public async saveSubmission(submission: Omit<Submission, 'id'>): Promise<DatabaseResult<string>> {
    // Alias for createSubmission for backward compatibility
    const result = await this.createSubmission(submission);
    if (result.success && result.data && typeof result.data === 'object' && 'id' in result.data) {
      return { success: true, data: (result.data as { id: string }).id, source: result.source };
    }
    return { success: false, error: result.message };
  }

  public async updateSubmission(id: string, updateData: Partial<Submission>): Promise<DatabaseResult<Submission>> {
    logger.info('DatabaseApiService: Updating submission', {
      component: 'DatabaseApiService',
      action: 'updateSubmission',
      data: { id }
    })

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Submission updated', {
          component: 'DatabaseApiService',
          action: 'updateSubmission',
          submissionId: id
        })
        return { success: true, data: result.data, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Submission update failed', {
          component: 'DatabaseApiService',
          action: 'updateSubmission',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Update failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Update submission error', {
        component: 'DatabaseApiService',
        action: 'updateSubmission',
        error: errorMessage
      })
      console.error('API: Failed to update submission:', error);
      return { success: false, message: "Update service unavailable.", error: errorMessage };
    }
  }

  public async updateSubmissionStatus(id: string, status: string): Promise<DatabaseResult<boolean>> {
    logger.info('DatabaseApiService: Updating submission status', {
      component: 'DatabaseApiService',
      action: 'updateSubmissionStatus',
      data: { id, status }
    })

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, data: true, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Update status failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Update submission status error', {
        component: 'DatabaseApiService',
        action: 'updateSubmissionStatus',
        error: errorMessage
      })
      return { success: false, message: "Update status service unavailable.", error: errorMessage };
    }
  }

  public async deleteSubmission(id: string): Promise<DatabaseResult<boolean>> {
    logger.info('DatabaseApiService: Deleting submission', {
      component: 'DatabaseApiService',
      action: 'deleteSubmission',
      data: { id }
    })

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Submission deleted', {
          component: 'DatabaseApiService',
          action: 'deleteSubmission',
          submissionId: id
        })
        return { success: true, data: true, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Submission deletion failed', {
          component: 'DatabaseApiService',
          action: 'deleteSubmission',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Deletion failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Delete submission error', {
        component: 'DatabaseApiService',
        action: 'deleteSubmission',
        error: errorMessage
      })
      return { success: false, message: "Delete service unavailable.", error: errorMessage };
    }
  }

  // ==================== TRACK METHODS (NEW PRISMA-COMPATIBLE) ====================

  /**
   * Create a new track for a submission
   */
  public async createTrack(trackData: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseResult<PrismaTrack>> {
    logger.info('DatabaseApiService: Creating track', {
      component: 'DatabaseApiService',
      action: 'createTrack',
      data: { submissionId: trackData.submissionId, title: trackData.title }
    })

    try {
      const response = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData)
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Track created', {
          component: 'DatabaseApiService',
          action: 'createTrack',
          trackId: result.data?.id
        })
        return { success: true, data: result.data, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Create track failed', {
          component: 'DatabaseApiService',
          action: 'createTrack',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Create track failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Create track error', {
        component: 'DatabaseApiService',
        action: 'createTrack',
        error: errorMessage
      })
      return { success: false, message: "Create track service unavailable.", error: errorMessage };
    }
  }

  /**
   * Update an existing track
   */
  public async updateTrack(trackId: string, updateData: Partial<PrismaTrack>): Promise<DatabaseResult<PrismaTrack>> {
    logger.info('DatabaseApiService: Updating track', {
      component: 'DatabaseApiService',
      action: 'updateTrack',
      data: { trackId }
    })

    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Track updated', {
          component: 'DatabaseApiService',
          action: 'updateTrack',
          trackId: trackId
        })
        return { success: true, data: result.data, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Track update failed', {
          component: 'DatabaseApiService',
          action: 'updateTrack',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Update track failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Update track error', {
        component: 'DatabaseApiService',
        action: 'updateTrack',
        error: errorMessage
      })
      return { success: false, message: "Update track service unavailable.", error: errorMessage };
    }
  }

  /**
   * Get all tracks for a specific submission
   */
  public async getTracksBySubmissionId(submissionId: string): Promise<DatabaseResult<PrismaTrack[]>> {
    logger.info('DatabaseApiService: Getting tracks by submission ID', {
      component: 'DatabaseApiService',
      action: 'getTracksBySubmissionId',
      data: { submissionId }
    })

    try {
      const response = await fetch(`/api/submissions/${submissionId}/tracks`);
      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, data: [], message: result.error ?? 'Failed to get tracks' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Get tracks by submission ID error', {
        component: 'DatabaseApiService',
        action: 'getTracksBySubmissionId',
        error: errorMessage
      })
      return { success: false, data: [], message: "Get tracks service unavailable.", error: errorMessage };
    }
  }

  /**
   * Get a specific track by ID
   */
  public async getTrackById(trackId: string): Promise<DatabaseResult<PrismaTrack>> {
    try {
      const response = await fetch(`/api/tracks/${trackId}`);
      const result = await response.json();

      if (result.success) {
        return { success: true, data: result.data, source: 'API' };
      } else {
        return { success: false, message: result.error ?? 'Failed to get track' };
      }
    } catch (error) {
      console.error('API: Failed to get track by ID:', error);
      return { success: false, message: "Track service unavailable." };
    }
  }

  /**
   * Delete a track
   */
  public async deleteTrack(trackId: string): Promise<DatabaseResult<boolean>> {
    logger.info('DatabaseApiService: Deleting track', {
      component: 'DatabaseApiService',
      action: 'deleteTrack',
      data: { trackId }
    })

    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Track deleted', {
          component: 'DatabaseApiService',
          action: 'deleteTrack',
          trackId: trackId
        })
        return { success: true, data: true, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Track deletion failed', {
          component: 'DatabaseApiService',
          action: 'deleteTrack',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Track deletion failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Delete track error', {
        component: 'DatabaseApiService',
        action: 'deleteTrack',
        error: errorMessage
      })
      return { success: false, message: "Delete track service unavailable.", error: errorMessage };
    }
  }

  /**
   * Create submission with tracks in a transaction (Prisma-compatible)
   */
  public async createSubmissionWithTracks(
    submissionData: Omit<PrismaSubmission, 'id' | 'createdAt' | 'updatedAt'>,
    tracksData: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt' | 'submissionId'>[]
  ): Promise<DatabaseResult<{ submission: PrismaSubmission; tracks: PrismaTrack[] }>> {
    logger.info('DatabaseApiService: Creating submission with tracks', {
      component: 'DatabaseApiService',
      action: 'createSubmissionWithTracks',
      data: { title: submissionData.title, trackCount: tracksData.length }
    })

    try {
      const response = await fetch('/api/submissions/with-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: submissionData, tracks: tracksData })
      });

      const result = await response.json();

      if (result.success) {
        logger.info('DatabaseApiService: Submission with tracks created', {
          component: 'DatabaseApiService',
          action: 'createSubmissionWithTracks',
          submissionId: result.data?.submission?.id
        })
        return { success: true, data: result.data, source: 'API' };
      } else {
        logger.error('DatabaseApiService: Create submission with tracks failed', {
          component: 'DatabaseApiService',
          action: 'createSubmissionWithTracks',
          error: result.error
        })
        return { success: false, message: result.error ?? 'Create submission with tracks failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Create submission with tracks error', {
        component: 'DatabaseApiService',
        action: 'createSubmissionWithTracks',
        error: errorMessage
      })
      return { success: false, message: "Create submission with tracks service unavailable.", error: errorMessage };
    }
  }

  /**
   * Helper method to create submission from legacy format (backward compatibility)
   */
  public async createSubmissionFromLegacy(legacySubmission: Omit<Submission, 'id'>): Promise<DatabaseResult<{ submission: PrismaSubmission; tracks: PrismaTrack[] }>> {
    try {
      // Convert legacy submission to Prisma format
      const submissionData: Omit<PrismaSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
        title: legacySubmission.songTitle,
        artist: legacySubmission.artistName,
        UPC: null,
        type: legacySubmission.releaseType === 'single' ? 'SINGLE' as any : 'SINGLE' as any,
        coverImagePath: legacySubmission.imageUrl || '',
        releaseDate: new Date(legacySubmission.releaseDate),
        status: 'PENDING' as any,
        metadataLocked: false,
        published: false,
        albumName: legacySubmission.albumName || null,
        mainCategory: legacySubmission.mainCategory || null,
        subCategory: legacySubmission.subCategory || null,
        platforms: null,
        distributionLink: null,
        distributionPlatforms: null,
        statusVietnamese: legacySubmission.status,
        rejectionReason: null,
        notes: legacySubmission.lyrics || null,
        creatorUID: legacySubmission.userId,
        labelId: legacySubmission.userId,
      };

      const tracksData: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt' | 'submissionId'>[] = [
        {
          title: legacySubmission.songTitle,
          artist: legacySubmission.artistName,
          filePath: legacySubmission.audioUrl || '',
          duration: 0,
          ISRC: legacySubmission.isrc || '',
          fileName: null,
          name: legacySubmission.fullName || null,
          fileSize: null,
          format: null,
          bitrate: null,
          sampleRate: null,
          mainCategory: legacySubmission.mainCategory || null,
          subCategory: legacySubmission.subCategory || null,
          lyrics: legacySubmission.lyrics || null,
        }
      ];

      return await this.createSubmissionWithTracks(submissionData, tracksData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('DatabaseApiService: Create submission from legacy error', {
        component: 'DatabaseApiService',
        action: 'createSubmissionFromLegacy',
        error: errorMessage
      })
      return { success: false, message: "Legacy submission conversion failed.", error: errorMessage };
    }
  }

  // ==================== VIDEO METHODS ====================

  public async getVideos(filter?: Record<string, unknown>): Promise<DatabaseResult<VideoInfo[]>> {
    try {
      const queryParams = filter ? `?${new URLSearchParams(filter as Record<string, string>).toString()}` : '';
      const response = await fetch(`/api/videos${queryParams}`);
      const result = await response.json();

      return result.success
        ? { success: true, data: result.data, source: 'API' }
        : { success: false, data: [], message: result.error ?? 'Failed to get videos' };
    } catch (error) {
      console.error('API: Failed to get videos:', error);
      return { success: false, data: [], message: "Video service unavailable." };
    }
  }

  public async saveVideo(video: Omit<VideoInfo, 'id'>): Promise<DatabaseResult<string>> {
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video)
      });

      const result = await response.json();
      return result.success
        ? { success: true, data: result.data?.id, source: 'API' }
        : { success: false, message: result.error ?? 'Save video failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, message: "Save video service unavailable.", error: errorMessage };
    }
  }

  // ==================== FILE EXPLORER METHODS ====================

  public async getFiles(folderId?: string): Promise<DatabaseResult<FileInfo[]>> {
    try {
      const queryParams = folderId ? `?folderId=${folderId}` : '';
      const response = await fetch(`/api/files${queryParams}`);
      const result = await response.json();

      return result.success
        ? { success: true, data: result.data, source: 'API' }
        : { success: false, data: [], message: result.error ?? 'Failed to get files' };
    } catch (error) {
      console.error('API: Failed to get files:', error);
      return { success: false, data: [], message: "File service unavailable." };
    }
  }

  public async getFolders(parentId?: string): Promise<DatabaseResult<FolderInfo[]>> {
    try {
      const queryParams = parentId ? `?parentId=${parentId}` : '';
      const response = await fetch(`/api/folders${queryParams}`);
      const result = await response.json();

      return result.success
        ? { success: true, data: result.data, source: 'API' }
        : { success: false, data: [], message: result.error ?? 'Failed to get folders' };
    } catch (error) {
      console.error('API: Failed to get folders:', error);
      return { success: false, data: [], message: "Folder service unavailable." };
    }
  }

  // ==================== SYSTEM METHODS ====================

  public async getStatus(): Promise<{ api: boolean; prisma: boolean; database: boolean }> {
    try {
      // Fix: sử dụng full URL khi chạy server-side
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/database-status`);
      const result = await response.json();

      return {
        api: this.apiAvailable,
        prisma: result.success,
        database: result.success,
      };
    } catch (error) {
      console.error('API: Failed to get status:', error);
      return {
        api: false,
        prisma: false,
        database: false,
      };
    }
  }

  public async testConnection(): Promise<DatabaseResult<boolean>> {
    logger.info('DatabaseApiService: Testing connection', {
      component: 'DatabaseApiService',
      action: 'testConnection'
    })

    try {
      // Fix: sử dụng full URL khi chạy server-side
      const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/database-status`)
      const result = await response.json()
      return { success: result.success, data: result.success, source: 'API' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Database connection test failed:', errorMessage)
      return { success: false, message: "Connection test failed.", error: errorMessage }
    }
  }
}

// Export singleton instances
export const databaseApiService = new DatabaseApiService()

// Backward compatibility exports
export const databaseService = databaseApiService
export const multiDB = databaseApiService
