-- Thêm bảng mới nếu chưa có
CREATE TABLE IF NOT EXISTS "public"."SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "social" TEXT,
    "url" JSONB,
    "homeUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "soundcloudUrl" TEXT,
    "applenusicUrl" TEXT
);

CREATE TABLE IF NOT EXISTS "public"."Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "submissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Thêm trường mới vào các bảng hiện có
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "UID" TEXT;
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "userName" TEXT;

ALTER TABLE "public"."Profile" ADD COLUMN IF NOT EXISTS "artist" TEXT;
ALTER TABLE "public"."Profile" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "public"."Profile" ADD COLUMN IF NOT EXISTS "userName" TEXT;

ALTER TABLE "public"."Track" ADD COLUMN IF NOT EXISTS "ISRC" TEXT;
ALTER TABLE "public"."Track" ADD COLUMN IF NOT EXISTS "IPI" TEXT;
ALTER TABLE "public"."Track" ADD COLUMN IF NOT EXISTS "ISWC" TEXT;

ALTER TABLE "public"."nhatKy" ADD COLUMN IF NOT EXISTS "userName" TEXT;

-- Thêm index/unique mới nếu cần
CREATE UNIQUE INDEX IF NOT EXISTS "User_userName_key" ON "public"."User"("userName");
CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userName_key" ON "public"."Profile"("userName");

-- Thêm foreign key cho Image nếu cần
ALTER TABLE "public"."Image" ADD CONSTRAINT IF NOT EXISTS "Image_submissionId_key" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Thêm giá trị enum mới nếu cần
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approvaltype') THEN
        CREATE TYPE "public"."ApprovalType" AS ENUM ('DSP', 'CONTENT_ID', 'ACR_CLOUD', 'LABEL_REVIEW');
    ELSE
        ALTER TYPE "public"."ApprovalType" ADD VALUE IF NOT EXISTS 'LABEL_REVIEW';
    END IF;
END$$;
