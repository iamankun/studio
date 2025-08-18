-- File: /studio/prisma/xaydung/xaydung.sql
-- Script to recreate database schema and insert initial data for project transfer.
-- Based on schema.prisma

-- Optional: Drop existing tables (use with caution as it will delete all data)
-- DROP TABLE IF EXISTS "User" CASCADE;
-- DROP TABLE IF EXISTS "Profile" CASCADE;
-- DROP TABLE IF EXISTS "SocialLink" CASCADE;
-- DROP TABLE IF EXISTS "Social" CASCADE;
-- DROP TABLE IF EXISTS "Label" CASCADE;
-- DROP TABLE IF EXISTS "Submission" CASCADE;
-- DROP TABLE IF EXISTS "Image" CASCADE;
-- DROP TABLE IF EXISTS "Track" CASCADE;
-- DROP TABLE IF EXISTS "Video" CASCADE;
-- DROP TABLE IF EXISTS "FileFolder" CASCADE;
-- DROP TABLE IF EXISTS "SubmissionContributor" CASCADE;
-- DROP TABLE IF EXISTS "TrackContributor" CASCADE;
-- DROP TABLE IF EXISTS "VideoContributor" CASCADE;
-- DROP TABLE IF EXISTS "SubmissionApproval" CASCADE;
-- DROP TABLE IF EXISTS "SubmissionComment" CASCADE;
-- DROP TABLE IF EXISTS "File" CASCADE;
-- DROP TABLE IF EXISTS "nhatKy" CASCADE;
-- DROP TABLE IF EXISTS "ExportTemplate" CASCADE;
-- DROP TABLE IF EXISTS "Export" CASCADE;
-- DROP TABLE IF EXISTS "SignatureDocument" CASCADE;
-- DROP TABLE IF EXISTS "DistributionPlatform" CASCADE;

-- Optional: Drop existing enum types (use with caution)
-- DROP TYPE IF EXISTS "UserRole";
-- DROP TYPE IF EXISTS "SubmissionStatus";
-- DROP TYPE IF EXISTS "ReleaseType";
-- DROP TYPE IF EXISTS "ContributorRole";
-- DROP TYPE IF EXISTS "ApprovalType";
-- DROP TYPE IF EXISTS "FileCategory";


-- Create enum types
-- Replace with actual PostgreSQL ENUM creation syntax if needed, or use TEXT type in tables
-- CREATE TYPE "UserRole" AS ENUM ('COMPOSER', 'PRODUCER', 'PERFORMER', 'LABEL_MANAGER', 'ADMINISTRATOR');
-- CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'PUBLISHED', 'CANCELLED', 'DRAFT');
-- CREATE TYPE "ReleaseType" AS ENUM ('SINGLE', 'EP', 'ALBUM', 'COMPILATION');
-- CREATE TYPE "ContributorRole" AS ENUM ('COMPOSER', 'LYRICIST', 'SINGERSONGWRITER', 'PRODUCER', 'PERFORMER', 'VOCALIST', 'RAPPER');
-- CREATE TYPE "ApprovalType" AS ENUM ('DSP', 'CONTENT_ID', 'ACR_CLOUD', 'LABEL_REVIEW');
-- CREATE TYPE "FileCategory" AS ENUM ('AUDIO', 'VIDEO', 'IMAGE', 'DOCUMENT', 'OTHER');


-- Create tables
CREATE TABLE "User" (
    "UID" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "password" TEXT NOT NULL,
    -- Handle UserRole[]: e.g., TEXT[] or a junction table
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT, -- Add UNIQUE and FOREIGN KEY to Profile later if using 1-to-1 relation with explicit foreign key
    "labelId" TEXT, -- Add FOREIGN KEY to Label later
    "ownedLabelId" TEXT, -- Add UNIQUE and FOREIGN KEY to Label later
    -- Handle relations: files, nhatKy, videos, fileFolders, etc.
    -- These might require join tables or foreign keys depending on cardinality
);

CREATE TABLE "Profile" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "bio" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT, -- Add UNIQUE constraint later
    "artist" TEXT,
    "name" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "userUID" TEXT NOT NULL, -- Add UNIQUE and FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    -- Handle socialLinks[]: e.g., TEXT[] or a separate SocialLink table related to Profile
);

CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "social" TEXT,
    "url" JSONB, -- Use JSONB for Json type
    "homeUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "soundCloudUrl" TEXT,
    "appleMusicUrl" TEXT
    -- Add foreign key to Profile if needed
);

CREATE TABLE "Social" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "type" TEXT,
    "name" TEXT,
    "url" TEXT
);

CREATE TABLE "Label" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "name" TEXT NOT NULL, -- Add UNIQUE constraint later
    "code" TEXT NOT NULL, -- Add UNIQUE constraint later
    "ownerUID" TEXT NOT NULL, -- Add UNIQUE and FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    -- Handle relations: members, users, submissions, videos
);

CREATE TABLE "Submission" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "UPC" TEXT, -- Add UNIQUE constraint later
    -- Handle ReleaseType: e.g., use TEXT or the created ENUM type
    "type" TEXT NOT NULL DEFAULT 'SINGLE',
    "coverImagePath" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    -- Handle SubmissionStatus: e.g., use TEXT or the created ENUM type
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "metadataLocked" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "albumName" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,
    "platforms" JSONB, -- Use JSONB
    "distributionLink" TEXT,
    "distributionPlatforms" JSONB, -- Use JSONB
    "statusVietnamese" TEXT,
    "rejectionReason" TEXT,
    "notes" TEXT,
    "labelId" TEXT NOT NULL, -- Add FOREIGN KEY to Label later
    "creatorUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    -- Handle relations: tracks, videos, contributors, comments, approvals, signatureDocument
);

CREATE TABLE "Image" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "url" TEXT NOT NULL,
    "submissionId" TEXT, -- Add FOREIGN KEY to Submission later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Track" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "ISRC" TEXT, -- Add UNIQUE constraint later
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
    "submissionId" TEXT NOT NULL, -- Add FOREIGN KEY to Submission later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    -- Handle relation: contributors
);

CREATE TABLE "Video" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
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
    "creatorUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "labelId" TEXT NOT NULL, -- Add FOREIGN KEY to Label later
    "submissionId" TEXT, -- Add FOREIGN KEY to Submission later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    -- Handle relation: contributors
);

CREATE TABLE "FileFolder" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL, -- Add UNIQUE constraint later
    "parentId" TEXT, -- Add FOREIGN KEY to FileFolder (self-referencing) later
    "ownerID" TEXT, -- Add FOREIGN KEY to User later
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
    -- Handle relations: children, files
);

CREATE TABLE "SubmissionContributor" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "role" TEXT NOT NULL,
    "percentage" REAL, -- Use REAL for Float
    "userUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "submissionId" TEXT NOT NULL, -- Add FOREIGN KEY to Submission later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TrackContributor" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    -- Handle ContributorRole: e.g., use TEXT or the created ENUM type
    "role" TEXT NOT NULL,
    "percentage" REAL, -- Use REAL
    "userUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "trackId" TEXT NOT NULL, -- Add FOREIGN KEY to Track later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "VideoContributor" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "role" TEXT NOT NULL,
    "percentage" REAL, -- Use REAL
    "userUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "videoId" TEXT NOT NULL, -- Add FOREIGN KEY to Video later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SubmissionApproval" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    -- Handle ApprovalType: e.g., use TEXT or the created ENUM type
    "type" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "reason" TEXT,
    "submissionId" TEXT NOT NULL, -- Add FOREIGN KEY to Submission later
    "approverUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SubmissionComment" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "content" TEXT NOT NULL,
    "userUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "submissionId" TEXT NOT NULL, -- Add FOREIGN KEY to Submission later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "File" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL, -- Add UNIQUE constraint later
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    -- Handle FileCategory: e.g., use TEXT or the created ENUM type
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "folderId" TEXT, -- Add FOREIGN KEY to FileFolder later
    "labelId" TEXT, -- Add FOREIGN KEY to Label later
    "userUID" TEXT, -- Add FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "nhatKy" ( -- Consider renaming to snake_case like "nhat_ky" and using @@map
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "action" TEXT NOT NULL,
    "details" JSONB, -- Use JSONB
    "userUID" TEXT, -- Add FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ExportTemplate" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "name" TEXT NOT NULL, -- Add UNIQUE constraint later
    "description" TEXT,
    "fields" JSONB NOT NULL, -- Use JSONB
    "format" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdByUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Export" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "templateId" TEXT NOT NULL, -- Add FOREIGN KEY to ExportTemplate later
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL,
    "exportedByUID" TEXT NOT NULL, -- Add FOREIGN KEY to User later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SignatureDocument" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "documentType" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL, -- Add UNIQUE and FOREIGN KEY to Submission later
    "documentPath" TEXT NOT NULL,
    "signedPath" TEXT,
    "signerName" TEXT,
    "signedAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "templateData" JSONB NOT NULL, -- Use JSONB
    "userUID" TEXT, -- Add FOREIGN KEY to User later
    "labelId" TEXT, -- Add FOREIGN KEY to Label later
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "DistributionPlatform" (
    "id" TEXT NOT NULL, -- Add PRIMARY KEY and @default(cuid()) logic here
    "name" TEXT NOT NULL, -- Add UNIQUE constraint later
    "logoUrl" TEXT,
    "apiEndpoint" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);


-- Add PRIMARY KEY constraints
-- ALTER TABLE "User" ADD PRIMARY KEY ("UID");
-- ALTER TABLE "Profile" ADD PRIMARY KEY ("id");
-- Add primary key constraints for all tables...

-- Add UNIQUE constraints
-- ALTER TABLE "Profile" ADD CONSTRAINT "Profile_phone_key" UNIQUE ("phone");
-- ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userUID_key" UNIQUE ("userUID");
-- Add unique constraints for all fields marked with @unique...

-- Add FOREIGN KEY constraints
-- ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userUID_fkey" FOREIGN KEY ("userUID") REFERENCES "User"("UID") ON DELETE CASCADE;
-- ALTER TABLE "Label" ADD CONSTRAINT "Label_ownerUID_fkey" FOREIGN KEY ("ownerUID") REFERENCES "User"("UID"); -- Adjust ON DELETE/SET NULL as needed
-- Add foreign key constraints for all relations...

-- Add INDEXes (Optional - for query performance)
-- CREATE INDEX "User_email_idx" ON "User"("email");
-- CREATE INDEX "Submission_title_idx" ON "Submission"("title");
-- Add indexes for frequently queried fields...


-- Insert initial data (including existing user accounts)
-- INSERT INTO "User" ("UID", "userName", "email", "password", "createdAt", "updatedAt") VALUES
-- ('cuid_of_user_1', 'username1', 'email1@example.com', 'hashed_password_1', 'YYYY-MM-DD HH:MM:SSZ', 'YYYY-MM-DD HH:MM:SSZ');
-- INSERT INTO "Profile" ("id", "userUID", "createdAt", "updatedAt", "verified") VALUES
-- ('cuid_of_profile_1', 'cuid_of_user_1', 'YYYY-MM-DD HH:MM:SSZ', 'YYYY-MM-DD HH:MM:SSZ', false);
-- Add INSERT statements for other tables and initial data...

// This file is for database schema and initial data for project transfer.

