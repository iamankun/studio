#!/usr/bin/env node

/**
 * Validation script for relational structure implementation
 * Checks if all required files and methods are properly implemented
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Validating Relational Structure Implementation');
console.log('================================================');

const checks = [];

// Check 1: Upload form view has been updated
console.log('\n1️⃣ Checking Upload Form View Updates...');
const uploadFormPath = join(rootDir, 'components/views/upload-form-view.tsx');
if (existsSync(uploadFormPath)) {
  const uploadFormContent = readFileSync(uploadFormPath, 'utf8');
  
  const hasNewImports = uploadFormContent.includes('PrismaSubmission') && 
                       uploadFormContent.includes('PrismaTrack') &&
                       uploadFormContent.includes('multiDB');
  
  const hasNewLogic = uploadFormContent.includes('createSubmissionWithTracks') &&
                     uploadFormContent.includes('tracksData') &&
                     uploadFormContent.includes('PrismaReleaseType');
  
  if (hasNewImports && hasNewLogic) {
    console.log('   ✅ Upload form updated with relational structure');
    checks.push({ name: 'Upload Form', status: 'PASS' });
  } else {
    console.log('   ❌ Upload form missing relational updates');
    checks.push({ name: 'Upload Form', status: 'FAIL' });
  }
} else {
  console.log('   ❌ Upload form file not found');
  checks.push({ name: 'Upload Form', status: 'FAIL' });
}

// Check 2: Submissions API updated
console.log('\n2️⃣ Checking Submissions API Updates...');
const submissionsApiPath = join(rootDir, 'app/api/submissions/route.ts');
if (existsSync(submissionsApiPath)) {
  const submissionsContent = readFileSync(submissionsApiPath, 'utf8');
  
  const hasRelationalSupport = submissionsContent.includes('submissionData.submission') &&
                              submissionsContent.includes('submissionData.tracks') &&
                              submissionsContent.includes('createSubmissionWithTracks');
  
  if (hasRelationalSupport) {
    console.log('   ✅ Submissions API supports relational structure');
    checks.push({ name: 'Submissions API', status: 'PASS' });
  } else {
    console.log('   ❌ Submissions API missing relational support');
    checks.push({ name: 'Submissions API', status: 'FAIL' });
  }
} else {
  console.log('   ❌ Submissions API file not found');
  checks.push({ name: 'Submissions API', status: 'FAIL' });
}

// Check 3: With-tracks endpoint created
console.log('\n3️⃣ Checking With-Tracks Endpoint...');
const withTracksPath = join(rootDir, 'app/api/submissions/with-tracks/route.ts');
if (existsSync(withTracksPath)) {
  const withTracksContent = readFileSync(withTracksPath, 'utf8');
  
  const hasCorrectStructure = withTracksContent.includes('POST') &&
                             withTracksContent.includes('createSubmissionWithTracks') &&
                             withTracksContent.includes('PrismaSubmission') &&
                             withTracksContent.includes('PrismaTrack');
  
  if (hasCorrectStructure) {
    console.log('   ✅ With-tracks endpoint properly implemented');
    checks.push({ name: 'With-Tracks Endpoint', status: 'PASS' });
  } else {
    console.log('   ❌ With-tracks endpoint has structural issues');
    checks.push({ name: 'With-Tracks Endpoint', status: 'FAIL' });
  }
} else {
  console.log('   ❌ With-tracks endpoint not created');
  checks.push({ name: 'With-Tracks Endpoint', status: 'FAIL' });
}

// Check 4: Tracks API created
console.log('\n4️⃣ Checking Tracks API...');
const tracksApiPath = join(rootDir, 'app/api/tracks/route.ts');
if (existsSync(tracksApiPath)) {
  const tracksContent = readFileSync(tracksApiPath, 'utf8');
  
  const hasCRUDMethods = tracksContent.includes('export async function GET') &&
                        tracksContent.includes('export async function POST') &&
                        tracksContent.includes('export async function PUT') &&
                        tracksContent.includes('export async function DELETE');
  
  const hasTrackMethods = tracksContent.includes('getTracksBySubmissionId') &&
                         tracksContent.includes('createTrack') &&
                         tracksContent.includes('updateTrack') &&
                         tracksContent.includes('deleteTrack');
  
  if (hasCRUDMethods && hasTrackMethods) {
    console.log('   ✅ Tracks API fully implemented with CRUD operations');
    checks.push({ name: 'Tracks API', status: 'PASS' });
  } else {
    console.log('   ❌ Tracks API missing some CRUD operations');
    checks.push({ name: 'Tracks API', status: 'FAIL' });
  }
} else {
  console.log('   ❌ Tracks API not created');
  checks.push({ name: 'Tracks API', status: 'FAIL' });
}

// Check 5: Submissions [id] endpoint updated
console.log('\n5️⃣ Checking Submissions [id] Endpoint Updates...');
const submissionIdPath = join(rootDir, 'app/api/submissions/[id]/route.ts');
if (existsSync(submissionIdPath)) {
  const submissionIdContent = readFileSync(submissionIdPath, 'utf8');
  
  const hasTrackSupport = submissionIdContent.includes('includeTracks') &&
                         submissionIdContent.includes('getTracksBySubmissionId') &&
                         submissionIdContent.includes('tracks: tracksResult.data');
  
  if (hasTrackSupport) {
    console.log('   ✅ Submissions [id] endpoint supports track inclusion');
    checks.push({ name: 'Submissions [id] API', status: 'PASS' });
  } else {
    console.log('   ❌ Submissions [id] endpoint missing track support');
    checks.push({ name: 'Submissions [id] API', status: 'FAIL' });
  }
} else {
  console.log('   ❌ Submissions [id] endpoint not found');
  checks.push({ name: 'Submissions [id] API', status: 'FAIL' });
}

// Check 6: Database service methods
console.log('\n6️⃣ Checking Database Service Methods...');
const dbServicePath = join(rootDir, 'lib/database-api-service.ts');
if (existsSync(dbServicePath)) {
  const dbContent = readFileSync(dbServicePath, 'utf8');
  
  const hasRequiredMethods = dbContent.includes('createSubmissionWithTracks') &&
                            dbContent.includes('getTracksBySubmissionId') &&
                            dbContent.includes('createTrack') &&
                            dbContent.includes('updateTrack') &&
                            dbContent.includes('deleteTrack') &&
                            dbContent.includes('getTrackById');
  
  if (hasRequiredMethods) {
    console.log('   ✅ Database service has all required relational methods');
    checks.push({ name: 'Database Service', status: 'PASS' });
  } else {
    console.log('   ❌ Database service missing some relational methods');
    checks.push({ name: 'Database Service', status: 'FAIL' });
  }
} else {
  console.log('   ❌ Database service file not found');
  checks.push({ name: 'Database Service', status: 'FAIL' });
}

// Check 7: Types and conversion utilities
console.log('\n7️⃣ Checking Types and Conversion Utilities...');
const typesPath = join(rootDir, 'types/submission.ts');
if (existsSync(typesPath)) {
  const typesContent = readFileSync(typesPath, 'utf8');
  
  const hasConversionUtils = typesContent.includes('convertLegacySubmissionToPrisma') &&
                            typesContent.includes('convertPrismaSubmissionToLegacy') &&
                            typesContent.includes('PrismaSubmission') &&
                            typesContent.includes('PrismaTrack');
  
  if (hasConversionUtils) {
    console.log('   ✅ Types and conversion utilities are available');
    checks.push({ name: 'Types & Conversion', status: 'PASS' });
  } else {
    console.log('   ❌ Types or conversion utilities missing');
    checks.push({ name: 'Types & Conversion', status: 'FAIL' });
  }
} else {
  console.log('   ❌ Types file not found');
  checks.push({ name: 'Types & Conversion', status: 'FAIL' });
}

// Summary
console.log('\n📊 Validation Summary');
console.log('====================');

const passedChecks = checks.filter(c => c.status === 'PASS').length;
const totalChecks = checks.length;

checks.forEach(check => {
  const icon = check.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${check.name}: ${check.status}`);
});

console.log(`\n🎯 Overall Status: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
  console.log('🎉 All validation checks passed! Relational structure implementation is complete.');
} else {
  console.log('⚠️  Some validation checks failed. Please review the implementation.');
}

console.log('\n📋 Next Steps:');
console.log('1. Run the test script: node scripts/test-relational-api.mjs');
console.log('2. Test the upload form in the browser');
console.log('3. Verify database operations work correctly');
console.log('4. Check backward compatibility with existing API consumers');