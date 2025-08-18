-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMINISTRATOR', 'LABEL_MANAGER', 'ARTIST', 'COMPOSER', 'PRODUCER', 'PERFORMER');

-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'PUBLISHED', 'CANCELLED', 'DRAFT');

-- CreateEnum
CREATE TYPE "public"."ReleaseType" AS ENUM ('SINGLE', 'EP', 'ALBUM', 'COMPILATION');

-- CreateEnum
CREATE TYPE "public"."ContributorRole" AS ENUM ('COMPOSER', 'LYRICIST', 'SINGERSONGWRITER', 'PRODUCER', 'PERFORMER', 'VOCALIST', 'RAPPER');

-- CreateEnum
CREATE TYPE "public"."ApprovalType" AS ENUM ('DSP', 'CONTENT_ID', 'ACR_CLOUD', 'LABEL_MANAGER');

-- CreateEnum
CREATE TYPE "public"."FileCategory" AS ENUM ('AUDIO', 'VIDEO', 'IMAGE', 'DOCUMENT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "roles" "public"."UserRole"[] DEFAULT ARRAY[]::"public"."UserRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "labelId" TEXT,

    CONSTRAINT "User_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "artistName" TEXT,
    "fullName" TEXT,
    "verified" BOOLEAN,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "appleMusicUrl" TEXT,
    "soundcloudUrl" TEXT,
    "userId" TEXT NOT NULL,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Label_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "UPC" TEXT,
    "type" "public"."ReleaseType" NOT NULL DEFAULT 'SINGLE',
    "coverImagePath" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'PENDING',
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
    "signedDocumentPath" TEXT,
    "signedAt" TIMESTAMP(3),
    "signerFullName" TEXT,
    "isDocumentSigned" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isrc" TEXT,
    "fileName" TEXT,
    "artistFullName" TEXT,
    "fileSize" INTEGER,
    "format" TEXT,
    "bitrate" TEXT,
    "sampleRate" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,
    "lyrics" TEXT,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Video" (
    "id" TEXT NOT NULL,
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
    "userId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "submissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,
    "ownerId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileFolder_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubmissionContributor" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionContributor_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackContributor" (
    "id" TEXT NOT NULL,
    "role" "public"."ContributorRole" NOT NULL,
    "percentage" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackContributor_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VideoContributor" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoContributor_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubmissionApproval" (
    "id" TEXT NOT NULL,
    "type" "public"."ApprovalType" NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "reason" TEXT,
    "submissionId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionApproval_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubmissionComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionComment_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "category" "public"."FileCategory" NOT NULL DEFAULT 'OTHER',
    "folderId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nhatKy" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nhatKy_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExportTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB NOT NULL,
    "format" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExportTemplate_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Export" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL,
    "exportedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Export_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SignatureDocument" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "documentPath" TEXT NOT NULL,
    "signedPath" TEXT,
    "signerName" TEXT,
    "signedAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "templateData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignatureDocument_key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DistributionPlatform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "apiEndpoint" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributionPlatform_key" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_key" ON "public"."Profile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "public"."Label"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Label_ownerId_key" ON "public"."Label"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_UPC_key" ON "public"."Submission"("UPC");

-- CreateIndex
CREATE UNIQUE INDEX "Track_isrc_key" ON "public"."Track"("isrc");

-- CreateIndex
CREATE UNIQUE INDEX "FileFolder_path_key" ON "public"."FileFolder"("path");

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "public"."File"("path");

-- CreateIndex
CREATE UNIQUE INDEX "ExportTemplate_name_key" ON "public"."ExportTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SignatureDocument_submissionId_key" ON "public"."SignatureDocument"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "DistributionPlatform_name_key" ON "public"."DistributionPlatform"("name");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_labelId_key" FOREIGN KEY ("labelId") REFERENCES "public"."Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_labelId_key" FOREIGN KEY ("labelId") REFERENCES "public"."Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Track" ADD CONSTRAINT "Track_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_labelId_key" FOREIGN KEY ("labelId") REFERENCES "public"."Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Video" ADD CONSTRAINT "Video_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileFolder" ADD CONSTRAINT "FileFolder_parentId_key" FOREIGN KEY ("parentId") REFERENCES "public"."FileFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileFolder" ADD CONSTRAINT "FileFolder_ownerId_key" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionContributor" ADD CONSTRAINT "SubmissionContributor_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackContributor" ADD CONSTRAINT "TrackContributor_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackContributor" ADD CONSTRAINT "TrackContributor_trackId_key" FOREIGN KEY ("trackId") REFERENCES "public"."Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoContributor" ADD CONSTRAINT "VideoContributor_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoContributor" ADD CONSTRAINT "VideoContributor_videoId_key" FOREIGN KEY ("videoId") REFERENCES "public"."Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionApproval" ADD CONSTRAINT "SubmissionApproval_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionApproval" ADD CONSTRAINT "SubmissionApproval_approverId_key" FOREIGN KEY ("approverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionComment" ADD CONSTRAINT "SubmissionComment_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionComment" ADD CONSTRAINT "SubmissionComment_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_folderId_key" FOREIGN KEY ("folderId") REFERENCES "public"."FileFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nhatKy" ADD CONSTRAINT "nhatKy_userId_key" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExportTemplate" ADD CONSTRAINT "ExportTemplate_createdBy_key" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Export" ADD CONSTRAINT "Export_templateId_key" FOREIGN KEY ("templateId") REFERENCES "public"."ExportTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Export" ADD CONSTRAINT "Export_exportedBy_key" FOREIGN KEY ("exportedBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SignatureDocument" ADD CONSTRAINT "SignatureDocument_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
