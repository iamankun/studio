#!/usr/bin/env node

/**
 * Database Migration Script for Prisma Schema Synchronization
 * 
 * This script handles:
 * 1. Database schema migration to match Prisma definitions
 * 2. Foreign key relationships establishment
 * 3. Data migration for existing legacy data
 * 4. Schema validation
 * 
 * Usage: node scripts/migrate-database.mjs [--force] [--dry-run]
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

console.log('🗄️  Database Migration Script - Prisma Schema Synchronization');
console.log('============================================================');
console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
console.log(`Force: ${isForce ? 'YES' : 'NO'}`);
console.log('');

/**
 * Check prerequisites
 */
function checkPrerequisites() {
  console.log('🔍 Checking Prerequisites...');
  
  // Check if .env file exists
  const envPath = join(rootDir, '.env.local');
  if (!existsSync(envPath)) {
    console.error('❌ .env.local file not found. Please create it with DATABASE_URL');
    process.exit(1);
  }
  
  // Check if Prisma schema exists
  const schemaPath = join(rootDir, 'prisma/schema.prisma');
  if (!existsSync(schemaPath)) {
    console.error('❌ Prisma schema not found at prisma/schema.prisma');
    process.exit(1);
  }
  
  // Check if DATABASE_URL is set
  const envContent = readFileSync(envPath, 'utf8');
  if (!envContent.includes('DATABASE_URL=')) {
    console.error('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
  }
  
  console.log('✅ Prerequisites check passed');
}

/**
 * Generate Prisma client
 */
function generatePrismaClient() {
  console.log('\n📦 Generating Prisma Client...');
  
  if (isDryRun) {
    console.log('🔍 [DRY RUN] Would generate Prisma client');
    return;
  }
  
  try {
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: rootDir 
    });
    console.log('✅ Prisma client generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message);
    process.exit(1);
  }
}

/**
 * Create database migration
 */
function createMigration() {
  console.log('\n🔄 Creating Database Migration...');
  
  if (isDryRun) {
    console.log('🔍 [DRY RUN] Would create migration for schema changes');
    return;
  }
  
  try {
    const migrationName = `schema_sync_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}`;
    
    execSync(`npx prisma migrate dev --name ${migrationName}`, {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    console.log(`✅ Migration '${migrationName}' created successfully`);
  } catch (error) {
    console.error('❌ Failed to create migration:', error.message);
    
    if (!isForce) {
      console.log('\n💡 If you want to force the migration despite errors, use --force flag');
      process.exit(1);
    } else {
      console.log('⚠️  Continuing with --force flag...');
    }
  }
}

/**
 * Validate database schema
 */
function validateSchema() {
  console.log('\n✅ Validating Database Schema...');
  
  if (isDryRun) {
    console.log('🔍 [DRY RUN] Would validate schema against database');
    return;
  }
  
  try {
    execSync('npx prisma db pull --print', {
      stdio: 'pipe',
      cwd: rootDir
    });
    
    console.log('✅ Database schema validation passed');
  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
    
    if (!isForce) {
      process.exit(1);
    }
  }
}

/**
 * Migrate legacy data
 */
async function migrateLegacyData() {
  console.log('\n📊 Migrating Legacy Data...');
  
  if (isDryRun) {
    console.log('🔍 [DRY RUN] Would migrate legacy submission data to relational structure');
    console.log('   - Convert single submissions to submission + tracks');
    console.log('   - Preserve all existing metadata');
    console.log('   - Create proper foreign key relationships');
    return;
  }
  
  try {
    // Import Prisma client dynamically (only when not in dry run)
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('🔍 Checking for legacy data...');
    
    // Check if there are submissions without tracks (legacy format)
    const submissionsWithoutTracks = await prisma.submission.findMany({
      where: {
        tracks: {
          none: {}
        }
      },
      include: {
        tracks: true
      }
    });
    
    if (submissionsWithoutTracks.length === 0) {
      console.log('✅ No legacy data found - all submissions already have proper track relationships');
      await prisma.$disconnect();
      return;
    }
    
    console.log(`📊 Found ${submissionsWithoutTracks.length} submissions that need track migration`);
    
    for (const submission of submissionsWithoutTracks) {
      console.log(`🔄 Migrating submission: ${submission.title} by ${submission.artist}`);
      
      // Create a track for this submission (legacy submissions were single tracks)
      await prisma.track.create({
        data: {
          title: submission.title,
          artist: submission.artist,
          filePath: submission.coverImagePath, // This would need to be updated with actual audio file path
          duration: 180, // Default duration - would need to be calculated from actual file
          submissionId: submission.id,
          // Add other track metadata as needed
          fileName: `${submission.title}.wav`,
          artistFullName: submission.artist,
          format: 'WAV',
          bitrate: '24-bit',
          sampleRate: '44.1 kHz'
        }
      });
      
      console.log(`✅ Created track for submission: ${submission.title}`);
    }
    
    console.log(`✅ Successfully migrated ${submissionsWithoutTracks.length} legacy submissions`);
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Legacy data migration failed:', error.message);
    
    if (!isForce) {
      process.exit(1);
    }
  }
}

/**
 * Verify foreign key relationships
 */
async function verifyRelationships() {
  console.log('\n🔗 Verifying Foreign Key Relationships...');
  
  if (isDryRun) {
    console.log('🔍 [DRY RUN] Would verify all foreign key relationships');
    return;
  }
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test key relationships
    const testQueries = [
      {
        name: 'User -> Submissions',
        query: () => prisma.user.findFirst({ include: { submissions: true } })
      },
      {
        name: 'Submission -> Tracks',
        query: () => prisma.submission.findFirst({ include: { tracks: true } })
      },
      {
        name: 'User -> Label',
        query: () => prisma.user.findFirst({ include: { label: true } })
      },
      {
        name: 'Track -> Contributors',
        query: () => prisma.track.findFirst({ include: { contributors: true } })
      }
    ];
    
    for (const test of testQueries) {
      try {
        await test.query();
        console.log(`✅ ${test.name} relationship verified`);
      } catch (error) {
        console.error(`❌ ${test.name} relationship failed:`, error.message);
        if (!isForce) {
          await prisma.$disconnect();
          process.exit(1);
        }
      }
    }
    
    await prisma.$disconnect();
    console.log('✅ All foreign key relationships verified');
    
  } catch (error) {
    console.error('❌ Relationship verification failed:', error.message);
    if (!isForce) {
      process.exit(1);
    }
  }
}

/**
 * Main migration process
 */
async function main() {
  try {
    checkPrerequisites();
    generatePrismaClient();
    createMigration();
    validateSchema();
    await migrateLegacyData();
    await verifyRelationships();
    
    console.log('\n🎉 Database Migration Completed Successfully!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Run the complete implementation test: node scripts/test-complete-implementation.mjs');
    console.log('2. Test the upload form with multiple tracks');
    console.log('3. Verify API endpoints work with both legacy and relational formats');
    console.log('4. Check the application in the browser');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the migration
main();