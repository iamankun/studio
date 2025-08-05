import { NextResponse } from 'next/server'
import { multiDB } from '@/lib/database-api-service'

export async function GET() {
    try {
        // Get system statistics
        const [artistsResult, submissionsResult] = await Promise.all([
            multiDB.getArtists(),
            multiDB.getSubmissions()
        ])

        const systemStats = {
            database: {
                connected: true,
                _type: 'connected',
                get type() {
                    return this._type
                },
                set type(value) {
                    this._type = value
                },
            },
            users: {
                totalArtists: artistsResult.success ? artistsResult.data?.length : 0,
                totalManagers: 1, // Could query label_manager table
                activeUsers: artistsResult.success ? artistsResult.data?.filter(u => u.createdAt).length : 0
            },
            content: {
                totalSubmissions: submissionsResult.success ? submissionsResult.data?.length : 0,
                pendingSubmissions: submissionsResult.success ?
                    submissionsResult.data?.filter(s => s.status === 'pending').length : 0,
                approvedSubmissions: submissionsResult.success ?
                    submissionsResult.data?.filter(s => s.status === 'approved').length : 0
            },
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: '2.0.0-beta',
                environment: process.env.NODE_ENV ?? 'Production'
            }
        }

        return NextResponse.json({
            success: true,
            data: systemStats
        })
    } catch (error) {
        console.error('Error fetching system stats:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch system statistics'
            },
            { status: 500 }
        )
    }
}
