import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { User } from '@/types/user'

/**
 * Hàm helper để thêm các header CORS tiêu chuẩn vào response.
 * @param response Đối tượng NextResponse cần chỉnh sửa.
 * @returns Đối tượng NextResponse đã được chỉnh sửa.
 */
function addCorsHeaders(response: NextResponse): NextResponse {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
}

export async function GET() {
    try {
        const artists = await prisma.user.findMany({
            where: {
                roles: {
                    has: 'Artist'
                }
            },
            include: {
                profile: true
            }
        });

        const resultData: User[] = artists.map(artist => ({
            id: artist.id,
            username: artist.name ?? artist.email,
            email: artist.email,
            name: artist.name ?? undefined,
            role: 'Artist',
            roles: artist.roles,
            fullName: artist.profile?.fullName ?? artist.name ?? undefined,
            createdAt: artist.createdAt.toISOString(),
            avatar: artist.profile?.avatarUrl ?? undefined,
            bio: artist.profile?.bio ?? undefined,
            socialLinks: (artist.profile?.socialLinks as Record<string, string>) ?? undefined,
            verified: artist.profile?.verified ?? false,
        }));
        
        const response = NextResponse.json({
            success: true,
            count: resultData.length,
            data: resultData,
            artists: resultData
        })
        return addCorsHeaders(response)
        
    } catch (error) {
        logger.error('Error in GET /api/artists', error, { component: 'ArtistsApi' })
        const errorResponse = NextResponse.json({
            success: false,
            message: 'An internal server error occurred.',
        }, { status: 500 })
        return addCorsHeaders(errorResponse)
    }
}

/**
 * Xử lý các request CORS preflight.
 */
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 })
    return addCorsHeaders(response)
}