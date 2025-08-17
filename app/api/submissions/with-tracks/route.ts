/// <reference types="node" />

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateUser } from "@/lib/auth-service"
import type { User } from "@/types/user"
import type { PrismaSubmission, PrismaTrack } from "@/types/submission"
import { logger } from "@/lib/logger"

// Helper function to get user from request (using session, token, etc.)
async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    // In production, you will parse JWT token
    const authHeader = request.headers.get('authorization')
    if (!authHeader) return null

    const [type, credentials] = authHeader.split(' ')
    if (type !== 'Basic') return null

    const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')

    const authResult = await authenticateUser(username, password)
    return authResult.success ? authResult.user || null : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { submission, tracks } = await request.json();
    logger.info('API Submission with tracks POST - input', { 
      title: submission?.title, 
      trackCount: tracks?.length 
    });

    const currentUser = await getUserFromRequest(request)

    if (!currentUser) {
      logger.warn('API Submission with tracks POST - Auth failed');
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    if (!submission || !tracks || !Array.isArray(tracks)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: submission and tracks array are required",
        },
        { status: 400 },
      )
    }
    
    const result = await prisma.$transaction(async (tx) => {
      const newSubmission = await tx.submission.create({
        data: {
          ...submission,
          userId: currentUser.id,
        }
      });
      
      const createdTracks = [];
      for(const track of tracks) {
        const newTrack = await tx.track.create({
          data: {
            ...track,
            submissionId: newSubmission.id,
          }
        });
        createdTracks.push(newTrack);
      }
      
      return { submission: newSubmission, tracks: createdTracks };
    });


    if (result) {
      logger.info('API Submission with tracks POST - success', { 
        id: result.submission.id,
        trackCount: result.tracks.length 
      });

      const response = NextResponse.json({
        success: true,
        message: "Submission with tracks created successfully",
        data: result,
        userRole: currentUser.role
      })

      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      return response
    } else {
      logger.error('API Submission with tracks POST - DB error', "Transaction failed");
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create submission with tracks",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    logger.error('API Submission with tracks POST - Exception', error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create submission with tracks",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 },
    )
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}