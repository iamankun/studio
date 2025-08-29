/**
 * Data Generation Script for AKS Studio
 * 
 * This script generates sample data for the application including:
 * - Users (artists, label managers, admins)
 * - Submissions (songs, albums, artwork)
 * - Labels and label assignments
 * - File management data
 * - Activity logs
 * 
 * Usage: npm run generate
 */

import dotenv from 'dotenv';
import pg from 'pg';
import chalk from 'chalk';
import { resolve } from 'path';

const { Pool } = pg;

// Load environment variables - Thử nhiều cách khác nhau
console.log('🔍 Đang tải biến môi trường...');

// Cách 1: Thử load từ .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Đường dẫn .env.local:', envPath);

const result = dotenv.config({ path: envPath });
console.log('Kết quả dotenv:', result.error || 'Success');

// Cách 2: Thử load từ .env nếu .env.local không có
if (result.error) {
  console.log('⚠️  .env.local failed, thử .env...');
  const envResult = dotenv.config({ path: resolve(process.cwd(), '.env') });
  console.log('Kết quả .env:', envResult.error || 'Success');
}

// Cách 3: Thử load mặc định
dotenv.config();

// Kiểm tra biến môi trường
let DATABASE_URL = process.env.DATABASE_URL;

console.log('🔍 Kiểm tra biến môi trường:');
console.log('DATABASE_URL tồn tại:', !!DATABASE_URL);
console.log('DATABASE_URL length:', DATABASE_URL ? DATABASE_URL.length : 0);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Tất cả biến có chứa DATABASE:', Object.keys(process.env).filter(key => key.includes('DATABASE')));

// Cách 4: Nếu vẫn không có, thử đọc trực tiếp từ file
if (!DATABASE_URL) {
  console.log('⚠️  Không tìm thấy DATABASE_URL, thử đọc trực tiếp từ file...');
  try {
    const fs = await import('fs');
    const fileContent = fs.readFileSync('.env.local', 'utf8');
    const lines = fileContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('DATABASE_URL=')) {
        DATABASE_URL = line.split('=')[1].replace(/"/g, '');
        console.log('✅ Đã tìm thấy DATABASE_URL từ file trực tiếp');
        break;
      }
    }
  } catch (error) {
    console.log('❌ Không thể đọc file .env.local:', error.message);
  }
}

if (!DATABASE_URL) {
  console.error(chalk.red('❌ DATABASE_URL not found in environment variables'));
  console.error(chalk.yellow('Make sure .env.local file exists with DATABASE_URL'));
  console.error('Current working directory:', process.cwd());
  process.exit(1);
}

// Sample data generators
const generateUsers = () => [
  // === TÀI KHOẢN THỰC (CHÍNH CHỦ) ===
  {
    userName: 'ankunstudio',
    email: 'ankunstudio@ankun.dev',
    password: '$2b$10$CnaLK1FPWHiHNrBa4FToxOutmeDM7uapyR2K.cUrCYKRn5v8rWQxi',
    roles: ['ADMINISTRATOR', 'LABEL_MANAGER', 'COMPOSER', 'PRODUCER', 'PERFORMER'],
    fullName: 'An Kun Studio',
    createdAt: new Date('2025-07-02 11:38:14.506125'),
    updatedAt: new Date()
  },
  // === DATA GIẢ ĐỂ TEST ===
  {
    userName: 'artist1',
    email: 'artist1@test.com',
    password: '$2b$10$testpassword1',
    roles: ['COMPOSER', 'PERFORMER'],
    fullName: 'Test Artist 1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    userName: 'producer1',
    email: 'producer1@test.com',
    password: '$2b$10$testpassword2',
    roles: ['PRODUCER'],
    fullName: 'Test Producer 1',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date()
  }
];

const generateProfiles = (userIds) => [
  {
    id: `profile_${Date.now()}`,
    bio: 'An Kun Studio - Digital Music Distribution Platform',
    avatarUrl: '/face.png',
    artist: 'An Kun Studio',
    name: 'An Kun',
    verified: true,
    userUID: userIds[0],
    socialLinks: ['https://ankun.dev', 'https://facebook.com/ankunstudio'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `profile_${Date.now() + 1}`,
    bio: 'Independent artist focusing on pop music',
    avatarUrl: '/default-avatar.png',
    artist: 'Test Artist 1',
    name: 'Nguyen Van A',
    verified: false,
    userUID: userIds[1],
    socialLinks: ['https://instagram.com/testartist1'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `profile_${Date.now() + 2}`,
    bio: 'Music producer specializing in electronic beats',
    avatarUrl: '/default-avatar.png',
    artist: 'Test Producer 1',
    name: 'Tran Van B',
    verified: false,
    userUID: userIds[2],
    socialLinks: ['https://soundcloud.com/testproducer1'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const generateLabels = (userIds) => [
  {
    id: `label_${Date.now()}`,
    name: 'An Kun Studio',
    code: 'AKS',
    ownerUID: userIds[0],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `label_${Date.now() + 1}`,
    name: 'Independent Records',
    code: 'INDIE',
    ownerUID: userIds[1],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const generateSubmissions = (userIds, labelIds) => [
  {
    id: `sub_${Date.now()}`,
    title: 'Summer Vibes',
    artist: 'An Kun Studio',
    type: 'SINGLE',
    coverImagePath: '/uploads/summer_vibes_cover.jpg',
    releaseDate: new Date('2024-06-01'),
    status: 'APPROVED',
    published: true,
    labelId: labelIds[0],
    creatorUID: userIds[0],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  },
  {
    id: `sub_${Date.now() + 1}`,
    title: 'City Nights EP',
    artist: 'Test Artist 1',
    type: 'EP',
    coverImagePath: '/uploads/city_nights_cover.jpg',
    releaseDate: new Date('2024-08-15'),
    status: 'PENDING',
    published: false,
    labelId: labelIds[1],
    creatorUID: userIds[1],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date()
  }
];

const generateTracks = (submissionIds) => [
  {
    id: `track_${Date.now()}`,
    title: 'Summer Vibes',
    artist: 'An Kun Studio',
    filePath: '/uploads/tracks/summer_vibes.wav',
    duration: 180,
    ISRC: 'VNA2P2400001',
    fileName: 'summer_vibes.wav',
    fileSize: 52428800,
    format: 'WAV',
    bitrate: '24-bit',
    sampleRate: '44.1 kHz',
    mainCategory: 'Pop',
    submissionId: submissionIds[0],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  },
  {
    id: `track_${Date.now() + 1}`,
    title: 'City Nights',
    artist: 'Test Artist 1',
    filePath: '/uploads/tracks/city_nights.wav',
    duration: 210,
    ISRC: 'VNA2P2400002',
    fileName: 'city_nights.wav',
    fileSize: 61440000,
    format: 'WAV',
    bitrate: '24-bit',
    sampleRate: '48 kHz',
    mainCategory: 'Electronic',
    submissionId: submissionIds[1],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date()
  }
];

const generateNhatKy = (userIds) => [
  {
    id: `log_${Date.now()}`,
    action: 'user_login',
    details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0' },
    userUID: userIds[0],
    createdAt: new Date()
  },
  {
    id: `log_${Date.now() + 1}`,
    action: 'submission_create',
    details: { submissionTitle: 'Summer Vibes', type: 'SINGLE' },
    userUID: userIds[0],
    createdAt: new Date('2024-03-01')
  }
];

const generateDistributionPlatforms = () => [
  {
    id: `platform_${Date.now()}`,
    name: 'Spotify',
    logoUrl: '/logos/spotify.png',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: `platform_${Date.now() + 1}`,
    name: 'Apple Music',
    logoUrl: '/logos/apple-music.png',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];





async function createTables(pool) {
  console.log(chalk.yellow('Creating tables if they don\'t exist...'));
  
  console.log(chalk.yellow('Sử dụng schema từ final.sql - bỏ qua tạo tables'));
  // Tables đã được tạo bởi final.sql migration







  console.log(chalk.green('✅ Using existing schema from final.sql'));
}

async function insertSampleData(pool) {
  console.log(chalk.yellow('Inserting sample data...'));
  
  // Clear existing data - chỉ truncate các bảng chính
  try {
    await pool.query('TRUNCATE "Track", "Submission", "Profile", "Label", "User" RESTART IDENTITY CASCADE');
  } catch (error) {
    console.log(chalk.yellow('⚠️  Some tables may not exist yet, continuing...'));
  }
  
  // Clear additional tables if they exist
  try {
    await pool.query('TRUNCATE "nhatKy", "DistributionPlatform" RESTART IDENTITY CASCADE');
  } catch (error) {
    console.log(chalk.yellow('⚠️  Additional tables not found, will create data anyway'));
  }
  
  // Insert users
  const users = generateUsers();
  const userIds = [];
  
  for (const user of users) {
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const result = await pool.query(`
      INSERT INTO "User" ("UID", "userName", "email", "password", "roles", "fullName", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING "UID"
    `, [uid, user.userName, user.email, user.password, user.roles, user.fullName, user.createdAt, user.updatedAt]);
    userIds.push(result.rows[0].UID);
  }
  
  console.log(chalk.green(`✅ Inserted ${users.length} users`));
  
  // Insert profiles
  const profiles = generateProfiles(userIds);
  for (const profile of profiles) {
    await pool.query(`
      INSERT INTO "Profile" ("id", "bio", "avatarUrl", "artist", "name", "verified", "userUID", "socialLinks", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [profile.id, profile.bio, profile.avatarUrl, profile.artist, profile.name, profile.verified, profile.userUID, profile.socialLinks, profile.createdAt, profile.updatedAt]);
  }
  
  console.log(chalk.green(`✅ Inserted ${profiles.length} profiles`));
  
  // Insert labels
  const labels = generateLabels(userIds);
  const labelIds = [];
  for (const label of labels) {
    await pool.query(`
      INSERT INTO "Label" ("id", "name", "code", "ownerUID", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [label.id, label.name, label.code, label.ownerUID, label.createdAt, label.updatedAt]);
    labelIds.push(label.id);
  }
  
  console.log(chalk.green(`✅ Inserted ${labels.length} labels`));
  
  // Insert submissions
  const submissions = generateSubmissions(userIds, labelIds);
  const submissionIds = [];
  for (const submission of submissions) {
    await pool.query(`
      INSERT INTO "Submission" ("id", "title", "artist", "type", "coverImagePath", "releaseDate", "status", "published", "labelId", "creatorUID", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [submission.id, submission.title, submission.artist, submission.type, submission.coverImagePath, submission.releaseDate, submission.status, submission.published, submission.labelId, submission.creatorUID, submission.createdAt, submission.updatedAt]);
    submissionIds.push(submission.id);
  }
  
  console.log(chalk.green(`✅ Inserted ${submissions.length} submissions`));
  
  // Insert tracks
  const tracks = generateTracks(submissionIds);
  for (const track of tracks) {
    await pool.query(`
      INSERT INTO "Track" ("id", "title", "artist", "filePath", "duration", "ISRC", "fileName", "fileSize", "format", "bitrate", "sampleRate", "mainCategory", "submissionId", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `, [track.id, track.title, track.artist, track.filePath, track.duration, track.ISRC, track.fileName, track.fileSize, track.format, track.bitrate, track.sampleRate, track.mainCategory, track.submissionId, track.createdAt, track.updatedAt]);
  }
  
  console.log(chalk.green(`✅ Inserted ${tracks.length} tracks`));
  
  // Insert nhatKy
  const logs = generateNhatKy(userIds);
  for (const log of logs) {
    await pool.query(`
      INSERT INTO "nhatKy" ("id", "action", "details", "userUID", "createdAt")
      VALUES ($1, $2, $3, $4, $5)
    `, [log.id, log.action, JSON.stringify(log.details), log.userUID, log.createdAt]);
  }
  
  console.log(chalk.green(`✅ Inserted ${logs.length} activity logs`));
  
  // Insert distribution platforms
  const platforms = generateDistributionPlatforms();
  for (const platform of platforms) {
    await pool.query(`
      INSERT INTO "DistributionPlatform" ("id", "name", "logoUrl", "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [platform.id, platform.name, platform.logoUrl, platform.isActive, platform.createdAt, platform.updatedAt]);
  }
  
  console.log(chalk.green(`✅ Inserted ${platforms.length} distribution platforms`));
}

async function main() {
  if (!DATABASE_URL) {
    console.error(chalk.red('❌ DATABASE_URL not found in environment variables'));
    console.error(chalk.yellow('Make sure .env.local file exists with DATABASE_URL'));
    process.exit(1);
  }

  console.log(chalk.blue('🎵 AKS Studio Data Generator'));
  console.log('='.repeat(50));
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log(chalk.green('✅ Database connection successful'));
    
    // Create tables
    await createTables(pool);
    
    // Insert sample data
    await insertSampleData(pool);
    
    console.log('='.repeat(50));
    console.log(chalk.green('🎉 Sample data generation completed successfully!'));
    console.log(chalk.blue('✅ Created:'));
    console.log(chalk.blue('   - 3 Users: ankunstudio + 2 test users'));
    console.log(chalk.blue('   - 3 Profiles: An Kun Studio + test profiles'));
    console.log(chalk.blue('   - 2 Labels: An Kun Studio (AKS) + Independent Records'));
    console.log(chalk.blue('   - 2 Submissions: Summer Vibes + City Nights EP'));
    console.log(chalk.blue('   - 2 Tracks: Summer Vibes + City Nights'));
    console.log(chalk.blue('   - 2 Activity Logs: login + submission create'));
    console.log(chalk.blue('   - 2 Distribution Platforms: Spotify + Apple Music'));
    console.log(chalk.blue('You can now start the development server with: npm run dev'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error during data generation:'));
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
main().catch(error => {
  console.error(chalk.red('❌ Unexpected error:'), error.message);
  process.exit(1);
});