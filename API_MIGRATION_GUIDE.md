# API Migration Guide - Legacy to Relational Structure

## Overview

This guide helps developers migrate from the legacy single-track submission API to the new relational structure supporting multiple tracks per release. The new API maintains backward compatibility while providing enhanced functionality.

## API Endpoint Changes

### Submissions API

#### GET /api/submissions

**Legacy Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_123",
      "track_title": "Song Name",
      "artist_username": "Artist Name",
      "created_at": "2024-01-01T00:00:00Z",
      "status": "pending"
    }
  ]
}
```

**New Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_123",
      "title": "Album Name",
      "artist": "Artist Name",
      "type": "ALBUM",
      "createdAt": "2024-01-01T00:00:00Z",
      "status": "PENDING",
      "tracks": [
        {
          "id": "track_456",
          "title": "Song Name",
          "artist": "Artist Name",
          "duration": 180,
          "filePath": "/uploads/song.wav"
        }
      ]
    }
  ]
}
```

**Migration Notes:**
- `track_title` → `title` (now refers to release title)
- `artist_username` → `artist`
- `created_at` → `createdAt`
- `status` values are now uppercase enums
- Individual tracks are now in `tracks` array

#### GET /api/submissions/[id]

**New Query Parameters:**
- `includeTracks=true` - Include tracks in response
- `includeContributors=true` - Include contributor information

**Example:**
```
GET /api/submissions/sub_123?includeTracks=true&includeContributors=true
```

#### POST /api/submissions

**Legacy Format (Still Supported):**
```json
{
  "track_title": "Song Name",
  "artist_username": "Artist Name",
  "file_path": "/uploads/song.wav",
  "duration": 180
}
```

**New Relational Format:**
```json
{
  "submission": {
    "title": "Album Name",
    "artist": "Artist Name",
    "type": "ALBUM",
    "coverImagePath": "/uploads/cover.jpg",
    "releaseDate": "2024-06-01T00:00:00Z"
  },
  "tracks": [
    {
      "title": "Song 1",
      "artist": "Artist Name",
      "filePath": "/uploads/song1.wav",
      "duration": 180
    },
    {
      "title": "Song 2", 
      "artist": "Artist Name",
      "filePath": "/uploads/song2.wav",
      "duration": 210
    }
  ]
}
```

### New Endpoints

#### POST /api/submissions/with-tracks

Create submission with multiple tracks in a single operation.

**Request:**
```json
{
  "submission": {
    "title": "My Album",
    "artist": "Artist Name",
    "type": "ALBUM",
    "coverImagePath": "/uploads/cover.jpg",
    "releaseDate": "2024-06-01T00:00:00Z",
    "albumName": "My Album",
    "mainCategory": "Pop",
    "subCategory": "Indie Pop"
  },
  "tracks": [
    {
      "title": "Track 1",
      "artist": "Artist Name",
      "filePath": "/uploads/track1.wav",
      "duration": 180,
      "fileName": "track1.wav",
      "format": "WAV",
      "bitrate": "24-bit",
      "sampleRate": "44.1 kHz"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": "sub_123",
      "title": "My Album",
      "artist": "Artist Name",
      "type": "ALBUM",
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tracks": [
      {
        "id": "track_456",
        "title": "Track 1",
        "submissionId": "sub_123",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### Tracks API

##### GET /api/tracks

Get tracks with optional filtering.

**Query Parameters:**
- `submissionId` - Filter by submission
- `userId` - Filter by user
- `limit` - Limit results (default: 50)
- `offset` - Pagination offset

**Example:**
```
GET /api/tracks?submissionId=sub_123&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "track_456",
      "title": "Track 1",
      "artist": "Artist Name",
      "duration": 180,
      "filePath": "/uploads/track1.wav",
      "submissionId": "sub_123",
      "isrc": "USRC17607839",
      "format": "WAV",
      "bitrate": "24-bit",
      "sampleRate": "44.1 kHz"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

##### POST /api/tracks

Create a new track.

**Request:**
```json
{
  "title": "New Track",
  "artist": "Artist Name",
  "filePath": "/uploads/new-track.wav",
  "duration": 195,
  "submissionId": "sub_123",
  "fileName": "new-track.wav",
  "format": "WAV",
  "bitrate": "24-bit",
  "sampleRate": "44.1 kHz"
}
```

##### PUT /api/tracks

Update an existing track.

**Request:**
```json
{
  "id": "track_456",
  "title": "Updated Track Title",
  "isrc": "USRC17607840"
}
```

##### DELETE /api/tracks

Delete a track.

**Request:**
```json
{
  "id": "track_456"
}
```

## Client-Side Migration

### JavaScript/TypeScript

#### Before (Legacy)
```typescript
// Fetch submissions
const response = await fetch('/api/submissions');
const { data: submissions } = await response.json();

submissions.forEach(submission => {
  console.log(`Track: ${submission.track_title} by ${submission.artist_username}`);
});

// Create submission
const newSubmission = {
  track_title: "My Song",
  artist_username: "My Artist",
  file_path: "/uploads/song.wav",
  duration: 180
};

await fetch('/api/submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newSubmission)
});
```

#### After (Relational)
```typescript
// Fetch submissions with tracks
const response = await fetch('/api/submissions?includeTracks=true');
const { data: submissions } = await response.json();

submissions.forEach(submission => {
  console.log(`Release: ${submission.title} by ${submission.artist}`);
  submission.tracks?.forEach(track => {
    console.log(`  Track: ${track.title} (${track.duration}s)`);
  });
});

// Create submission with multiple tracks
const newSubmission = {
  submission: {
    title: "My Album",
    artist: "My Artist",
    type: "ALBUM",
    coverImagePath: "/uploads/cover.jpg",
    releaseDate: new Date().toISOString()
  },
  tracks: [
    {
      title: "Song 1",
      artist: "My Artist",
      filePath: "/uploads/song1.wav",
      duration: 180
    },
    {
      title: "Song 2",
      artist: "My Artist", 
      filePath: "/uploads/song2.wav",
      duration: 210
    }
  ]
};

await fetch('/api/submissions/with-tracks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newSubmission)
});
```

### React Components

#### Before (Legacy)
```tsx
function SubmissionList() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => setSubmissions(data.data));
  }, []);

  return (
    <div>
      {submissions.map(submission => (
        <div key={submission.id}>
          <h3>{submission.track_title}</h3>
          <p>by {submission.artist_username}</p>
          <p>Status: {submission.status}</p>
        </div>
      ))}
    </div>
  );
}
```

#### After (Relational)
```tsx
function SubmissionList() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch('/api/submissions?includeTracks=true')
      .then(res => res.json())
      .then(data => setSubmissions(data.data));
  }, []);

  return (
    <div>
      {submissions.map(submission => (
        <div key={submission.id}>
          <h3>{submission.title}</h3>
          <p>by {submission.artist}</p>
          <p>Type: {submission.type}</p>
          <p>Status: {submission.status}</p>
          
          {submission.tracks && (
            <div>
              <h4>Tracks:</h4>
              <ul>
                {submission.tracks.map(track => (
                  <li key={track.id}>
                    {track.title} ({Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Form Handling

#### Before (Single Track)
```tsx
function SubmissionForm() {
  const [formData, setFormData] = useState({
    track_title: '',
    artist_username: '',
    file_path: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Track Title"
        value={formData.track_title}
        onChange={(e) => setFormData({...formData, track_title: e.target.value})}
      />
      <input
        type="text"
        placeholder="Artist"
        value={formData.artist_username}
        onChange={(e) => setFormData({...formData, artist_username: e.target.value})}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### After (Multiple Tracks)
```tsx
function SubmissionForm() {
  const [submission, setSubmission] = useState({
    title: '',
    artist: '',
    type: 'SINGLE',
    coverImagePath: ''
  });
  
  const [tracks, setTracks] = useState([
    { title: '', artist: '', filePath: '', duration: 0 }
  ]);

  const addTrack = () => {
    setTracks([...tracks, { title: '', artist: '', filePath: '', duration: 0 }]);
  };

  const updateTrack = (index, field, value) => {
    const updatedTracks = [...tracks];
    updatedTracks[index][field] = value;
    setTracks(updatedTracks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetch('/api/submissions/with-tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission, tracks })
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Release Information</h3>
      <input
        type="text"
        placeholder="Release Title"
        value={submission.title}
        onChange={(e) => setSubmission({...submission, title: e.target.value})}
      />
      <input
        type="text"
        placeholder="Artist"
        value={submission.artist}
        onChange={(e) => setSubmission({...submission, artist: e.target.value})}
      />
      <select
        value={submission.type}
        onChange={(e) => setSubmission({...submission, type: e.target.value})}
      >
        <option value="SINGLE">Single</option>
        <option value="EP">EP</option>
        <option value="ALBUM">Album</option>
      </select>

      <h3>Tracks</h3>
      {tracks.map((track, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Track Title"
            value={track.title}
            onChange={(e) => updateTrack(index, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="Artist"
            value={track.artist}
            onChange={(e) => updateTrack(index, 'artist', e.target.value)}
          />
          <input
            type="text"
            placeholder="File Path"
            value={track.filePath}
            onChange={(e) => updateTrack(index, 'filePath', e.target.value)}
          />
        </div>
      ))}
      
      <button type="button" onClick={addTrack}>Add Track</button>
      <button type="submit">Submit Release</button>
    </form>
  );
}
```

## Error Handling

### New Error Codes

The API now returns more specific error codes:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid submission data",
    "details": {
      "field": "tracks",
      "reason": "At least one track is required"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

### Error Handling Example

```typescript
async function createSubmission(data) {
  try {
    const response = await fetch('/api/submissions/with-tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      switch (result.error.code) {
        case 'VALIDATION_ERROR':
          console.error('Validation failed:', result.error.details);
          break;
        case 'UNAUTHORIZED':
          // Redirect to login
          window.location.href = '/login';
          break;
        default:
          console.error('Unknown error:', result.error.message);
      }
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

## Backward Compatibility

### Legacy Format Support

The API maintains backward compatibility by:

1. **Accepting legacy format** - Old POST requests still work
2. **Converting responses** - Legacy clients receive converted responses
3. **Property mapping** - Automatic conversion between naming conventions

### Conversion Utilities

For client-side compatibility, use the provided conversion utilities:

```typescript
import { 
  convertLegacySubmissionToPrisma, 
  convertPrismaSubmissionToLegacy 
} from '../types/submission';

// Convert legacy data to new format
const legacySubmission = {
  track_title: "Song Name",
  artist_username: "Artist Name",
  created_at: "2024-01-01T00:00:00Z"
};

const prismaFormat = convertLegacySubmissionToPrisma(legacySubmission);

// Convert new format to legacy for old clients
const prismaSubmission = {
  title: "Song Name",
  artist: "Artist Name", 
  createdAt: "2024-01-01T00:00:00Z",
  tracks: [...]
};

const legacyFormat = convertPrismaSubmissionToLegacy(prismaSubmission);
```

## Testing Your Migration

### 1. API Testing

Use the provided test script:

```bash
node scripts/test-relational-api.mjs
```

### 2. Manual Testing

Test key scenarios:

1. **Create single track submission** (legacy format)
2. **Create multi-track submission** (new format)
3. **Fetch submissions with tracks**
4. **Update individual tracks**
5. **Delete tracks and submissions**

### 3. Integration Testing

```typescript
// Test legacy compatibility
const legacyResponse = await fetch('/api/submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    track_title: "Test Song",
    artist_username: "Test Artist",
    file_path: "/test.wav"
  })
});

// Test new format
const newResponse = await fetch('/api/submissions/with-tracks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    submission: { title: "Test Album", artist: "Test Artist", type: "ALBUM" },
    tracks: [{ title: "Track 1", artist: "Test Artist", filePath: "/track1.wav", duration: 180 }]
  })
});
```

## Performance Considerations

### 1. Lazy Loading

Only include tracks when needed:

```typescript
// Fast - no tracks included
const submissions = await fetch('/api/submissions');

// Slower - includes all tracks
const submissionsWithTracks = await fetch('/api/submissions?includeTracks=true');
```

### 2. Pagination

Use pagination for large datasets:

```typescript
const page1 = await fetch('/api/submissions?limit=20&offset=0');
const page2 = await fetch('/api/submissions?limit=20&offset=20');
```

### 3. Caching

Cache frequently accessed data:

```typescript
// Cache submissions list
const cachedSubmissions = localStorage.getItem('submissions');
if (cachedSubmissions && Date.now() - lastFetch < 300000) { // 5 minutes
  return JSON.parse(cachedSubmissions);
}
```

## Migration Checklist

### Pre-Migration
- [ ] Review API changes in this guide
- [ ] Update client-side code to handle new response format
- [ ] Test with both legacy and new API formats
- [ ] Update error handling for new error codes
- [ ] Plan for gradual migration of existing clients

### During Migration
- [ ] Deploy API changes with backward compatibility
- [ ] Monitor API usage and error rates
- [ ] Gradually migrate clients to new endpoints
- [ ] Update documentation and examples

### Post-Migration
- [ ] Verify all clients are working correctly
- [ ] Monitor performance metrics
- [ ] Plan deprecation timeline for legacy endpoints
- [ ] Update client libraries and SDKs

## Support and Resources

### Documentation
- [Prisma Schema Reference](./prisma/schema.prisma)
- [Database Service API](./lib/database-api-service.ts)
- [Type Definitions](./types/submission.ts)

### Testing Tools
- [Migration Test Script](./scripts/test-complete-implementation.mjs)
- [API Validation Script](./scripts/validate-relational-implementation.mjs)

### Contact
For migration support, please refer to the project documentation or create an issue in the repository.

---

**Last Updated:** August 6, 2025  
**API Version:** 2.0.0  
**Backward Compatibility:** Maintained until v3.0.0