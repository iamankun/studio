#!/usr/bin/env node

/**
 * Test script for relational API endpoints
 * Tests the new submission with tracks functionality
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_AUTH = 'Basic ' + Buffer.from('testuser:testpass').toString('base64');

console.log('🧪 Testing Relational API Endpoints');
console.log('=====================================');

// Test data
const testSubmissionData = {
  title: "Test Song Relational",
  artist: "Test Artist",
  upc: null,
  type: "SINGLE",
  coverImagePath: "/test-cover.jpg",
  releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  status: "PENDING",
  metadataLocked: false,
  published: false,
  albumName: null,
  mainCategory: "pop",
  subCategory: "official",
  platforms: null,
  distributionLink: null,
  distributionPlatforms: null,
  statusVietnamese: "Đã nhận, đang chờ duyệt",
  rejectionReason: null,
  notes: null,
  userId: "test-user-id",
  labelId: "test-label-id"
};

const testTracksData = [
  {
    title: "Test Track 1",
    artist: "Test Artist",
    filePath: "/test-track-1.wav",
    duration: 180,
    isrc: "VNA2P2500001",
    fileName: "test-track-1.wav",
    artistFullName: "Test Artist Full Name",
    fileSize: 5000000,
    format: "audio/wav",
    bitrate: "320kbps",
    sampleRate: "44100Hz"
  },
  {
    title: "Test Track 2",
    artist: "Test Artist",
    filePath: "/test-track-2.wav",
    duration: 200,
    isrc: "VNA2P2500002",
    fileName: "test-track-2.wav",
    artistFullName: "Test Artist Full Name",
    fileSize: 6000000,
    format: "audio/wav",
    bitrate: "320kbps",
    sampleRate: "44100Hz"
  }
];

async function testAPI(endpoint, method = 'GET', data = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TEST_AUTH,
        ...headers
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    console.log(`\n📡 ${method} ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();

    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${result.success}`);
    
    if (result.success) {
      console.log(`   ✅ ${result.message || 'Success'}`);
      if (result.data) {
        if (Array.isArray(result.data)) {
          console.log(`   📊 Data count: ${result.data.length}`);
        } else if (result.data.submission && result.data.tracks) {
          console.log(`   📊 Submission ID: ${result.data.submission.id}`);
          console.log(`   📊 Tracks count: ${result.data.tracks.length}`);
        }
      }
    } else {
      console.log(`   ❌ ${result.message || 'Failed'}`);
    }

    return result;
  } catch (error) {
    console.log(`   💥 Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('\n1️⃣ Testing Submission with Tracks Creation');
  console.log('--------------------------------------------');
  
  const createResult = await testAPI('/api/submissions/with-tracks', 'POST', {
    submission: testSubmissionData,
    tracks: testTracksData
  });

  if (!createResult.success) {
    console.log('❌ Cannot proceed with other tests - submission creation failed');
    return;
  }

  const submissionId = createResult.data?.submission?.id;
  const trackIds = createResult.data?.tracks?.map(t => t.id) || [];

  console.log('\n2️⃣ Testing Get Submission with Tracks');
  console.log('--------------------------------------');
  
  if (submissionId) {
    await testAPI(`/api/submissions/${submissionId}?includeTracks=true`);
  }

  console.log('\n3️⃣ Testing Get Tracks by Submission ID');
  console.log('---------------------------------------');
  
  if (submissionId) {
    await testAPI(`/api/tracks?submissionId=${submissionId}`);
  }

  console.log('\n4️⃣ Testing Individual Track Operations');
  console.log('---------------------------------------');
  
  if (trackIds.length > 0) {
    const trackId = trackIds[0];
    
    // Test get individual track
    await testAPI(`/api/tracks/${trackId}`, 'GET');
    
    // Test update track
    await testAPI('/api/tracks', 'PUT', {
      id: trackId,
      title: "Updated Test Track 1",
      duration: 185
    });
  }

  console.log('\n5️⃣ Testing Legacy Submission Creation (Backward Compatibility)');
  console.log('--------------------------------------------------------------');
  
  const legacySubmission = {
    track_title: "Legacy Test Song",
    artist_name: "Legacy Test Artist",
    genre: "pop",
    status: "pending"
  };
  
  await testAPI('/api/submissions', 'POST', legacySubmission);

  console.log('\n🎯 Test Summary');
  console.log('===============');
  console.log('✅ All API endpoints have been tested');
  console.log('📋 Check the logs above for detailed results');
  console.log('🔧 If any tests failed, check the server logs for more details');
}

// Run the tests
runTests().catch(console.error);