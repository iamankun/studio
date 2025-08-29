-- Final Migration SQL for AKS Studio
-- Combines all migrations and matches current schema.prisma

-- Create ENUMs
CREATE TYPE "UserRole" AS ENUM ('COMPOSER', 'PRODUCER', 'PERFORMER', 'LABEL_MANAGER', 'ADMINISTRATOR');
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'PUBLISHED', 'CANCELLED', 'DRAFT');
CREATE TYPE "ReleaseType" AS ENUM ('SINGLE', 'EP', 'ALBUM', 'COMPILATION');
CREATE TYPE "ContributorRole" AS ENUM ('COMPOSER', 'LYRICIST', 'SINGERSONGWRITER', 'PRODUCER', 'PERFORMER', 'VOCALIST', 'RAPPER');
CREATE TYPE "ApprovalType" AS ENUM ('DSP', 'CONTENT_ID', 'ACR_CLOUD', 'LABEL_REVIEW');
CREATE TYPE "FileCategory" AS ENUM ('AUDIO', 'VIDEO', 'IMAGE', 'DOCUMENT', 'OTHER');

-- User table
CREATE TABLE "User" (
    "UID" TEXT PRIMARY KEY,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "password" TEXT NOT NULL,
    "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "labelId" TEXT
);

-- Profile table
CREATE TABLE "Profile" (
    "id" TEXT PRIMARY KEY,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "artist" TEXT,
    "name" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "userUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "socialLinks" TEXT[]
);

-- SocialLink table
CREATE TABLE "SocialLink" (
    "id" TEXT PRIMARY KEY,
    "social" TEXT,
    "url" JSONB,
    "homeUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "soundCloudUrl" TEXT,
    "appleMusicUrl" TEXT
);

-- Social table
CREATE TABLE "Social" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT,
    "name" TEXT,
    "url" TEXT
);

-- Label table
CREATE TABLE "Label" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Submission table
CREATE TABLE "Submission" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "UPC" TEXT,
    "type" "ReleaseType" NOT NULL DEFAULT 'SINGLE',
    "coverImagePath" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "metadataLocked" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "albumName" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,
    "platforms" JSONB,
    "distributionLink" TEXT,
    "distributionPlatforms" JSONB,
    "statusVietnamese" TEXT,
    "rejectionReason" TEXT,
    "notes" TEXT,
    "labelId" TEXT NOT NULL,
    "creatorUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Image table
CREATE TABLE "Image" (
    "id" TEXT PRIMARY KEY,
    "url" TEXT NOT NULL,
    "submissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Track table
CREATE TABLE "Track" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "ISRC" TEXT,
    "IPI" TEXT,
    "ISWC" TEXT,
    "fileName" TEXT,
    "name" TEXT,
    "fileSize" INTEGER,
    "format" TEXT,
    "bitrate" TEXT,
    "sampleRate" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,
    "lyrics" TEXT,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Video table
CREATE TABLE "Video" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "youtubeVideoId" TEXT,
    "youtubeUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "description" TEXT,
    "tags" TEXT,
    "category" TEXT,
    "language" TEXT,
    "contentIdEnabled" BOOLEAN NOT NULL DEFAULT false,
    "contentIdStatus" TEXT,
    "creatorUID" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "submissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FileFolder table
CREATE TABLE "FileFolder" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,
    "ownerID" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SubmissionContributor table
CREATE TABLE "SubmissionContributor" (
    "id" TEXT PRIMARY KEY,
    "role" TEXT NOT NULL,
    "percentage" REAL,
    "userUID" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TrackContributor table
CREATE TABLE "TrackContributor" (
    "id" TEXT PRIMARY KEY,
    "role" "ContributorRole" NOT NULL,
    "percentage" REAL,
    "userUID" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- VideoContributor table
CREATE TABLE "VideoContributor" (
    "id" TEXT PRIMARY KEY,
    "role" TEXT NOT NULL,
    "percentage" REAL,
    "userUID" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SubmissionApproval table
CREATE TABLE "SubmissionApproval" (
    "id" TEXT PRIMARY KEY,
    "type" "ApprovalType" NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "reason" TEXT,
    "submissionId" TEXT NOT NULL,
    "approverUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SubmissionComment table
CREATE TABLE "SubmissionComment" (
    "id" TEXT PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userUID" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- File table
CREATE TABLE "File" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "category" "FileCategory" NOT NULL DEFAULT 'OTHER',
    "folderId" TEXT,
    "labelId" TEXT,
    "userUID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- nhatKy table
CREATE TABLE "nhatKy" (
    "id" TEXT PRIMARY KEY,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userUID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ExportTemplate table
CREATE TABLE "ExportTemplate" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "format" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdByUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Export table
CREATE TABLE "Export" (
    "id" TEXT PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL,
    "exportedByUID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SignatureDocument table
CREATE TABLE "SignatureDocument" (
    "id" TEXT PRIMARY KEY,
    "documentType" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "documentPath" TEXT NOT NULL,
    "signedPath" TEXT,
    "signerName" TEXT,
    "signedAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "templateData" JSONB NOT NULL,
    "userUID" TEXT,
    "labelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DistributionPlatform table
CREATE TABLE "DistributionPlatform" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "apiEndpoint" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add UNIQUE constraints
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_phone_key" UNIQUE ("phone");
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userUID_key" UNIQUE ("userUID");
ALTER TABLE "Label" ADD CONSTRAINT "Label_name_key" UNIQUE ("name");
ALTER TABLE "Label" ADD CONSTRAINT "Label_code_key" UNIQUE ("code");
ALTER TABLE "Label" ADD CONSTRAINT "Label_ownerUID_key" UNIQUE ("ownerUID");
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_UPC_key" UNIQUE ("UPC");
ALTER TABLE "Track" ADD CONSTRAINT "Track_ISRC_key" UNIQUE ("ISRC");
ALTER TABLE "FileFolder" ADD CONSTRAINT "FileFolder_path_key" UNIQUE ("path");
ALTER TABLE "File" ADD CONSTRAINT "File_path_key" UNIQUE ("path");
ALTER TABLE "ExportTemplate" ADD CONSTRAINT "ExportTemplate_name_key" UNIQUE ("name");
ALTER TABLE "SignatureDocument" ADD CONSTRAINT "SignatureDocument_submissionId_key" UNIQUE ("submissionId");
ALTER TABLE "DistributionPlatform" ADD CONSTRAINT "DistributionPlatform_name_key" UNIQUE ("name");

-- Add FOREIGN KEY constraints
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID") ON DELETE CASCADE;
ALTER TABLE "Label" ADD CONSTRAINT "Label_ownerUID_fkey" FOREIGN KEY ("ownerUID") REFERENCES "User"("UID");
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id");
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_creatorUID_fkey" FOREIGN KEY ("creatorUID") REFERENCES "User"("UID");
ALTER TABLE "Image" ADD CONSTRAINT "Image_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id");
ALTER TABLE "Track" ADD CONSTRAINT "Track_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE;
ALTER TABLE "Video" ADD CONSTRAINT "Video_creatorUID_fkey" FOREIGN KEY ("creatorUID") REFERENCES "User"("UID");
ALTER TABLE "Video" ADD CONSTRAINT "Video_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id");
ALTER TABLE "Video" ADD CONSTRAINT "Video_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id");
ALTER TABLE "FileFolder" ADD CONSTRAINT "FileFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FileFolder"("id");
ALTER TABLE "FileFolder" ADD CONSTRAINT "FileFolder_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("UID");
ALTER TABLE "SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE;
ALTER TABLE "TrackContributor" ADD CONSTRAINT "TrackContributor_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "TrackContributor" ADD CONSTRAINT "TrackContributor_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE;
ALTER TABLE "VideoContributor" ADD CONSTRAINT "VideoContributor_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "VideoContributor" ADD CONSTRAINT "VideoContributor_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE;
ALTER TABLE "SubmissionApproval" ADD CONSTRAINT "SubmissionApproval_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE;
ALTER TABLE "SubmissionApproval" ADD CONSTRAINT "SubmissionApproval_approverUID_fkey" FOREIGN KEY ("approverUID") REFERENCES "User"("UID");
ALTER TABLE "SubmissionComment" ADD CONSTRAINT "SubmissionComment_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "SubmissionComment" ADD CONSTRAINT "SubmissionComment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE;
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "FileFolder"("id");
ALTER TABLE "File" ADD CONSTRAINT "File_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id");
ALTER TABLE "File" ADD CONSTRAINT "File_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "nhatKy" ADD CONSTRAINT "nhatKy_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "ExportTemplate" ADD CONSTRAINT "ExportTemplate_createdByUID_fkey" FOREIGN KEY ("createdByUID") REFERENCES "User"("UID");
ALTER TABLE "Export" ADD CONSTRAINT "Export_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ExportTemplate"("id");
ALTER TABLE "Export" ADD CONSTRAINT "Export_exportedByUID_fkey" FOREIGN KEY ("exportedByUID") REFERENCES "User"("UID");
ALTER TABLE "SignatureDocument" ADD CONSTRAINT "SignatureDocument_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id");
ALTER TABLE "SignatureDocument" ADD CONSTRAINT "SignatureDocument_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID");
ALTER TABLE "SignatureDocument" ADD CONSTRAINT "SignatureDocument_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id");
ALTER TABLE "User" ADD CONSTRAINT "User_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id");