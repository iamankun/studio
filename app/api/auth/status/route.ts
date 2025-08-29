import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return no user (not authenticated)
    // This will be implemented with proper session management later
    return NextResponse.json({
      success: false,
      user: null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to check auth status'
    }, { status: 500 });
  }
}