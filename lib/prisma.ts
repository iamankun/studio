import { PrismaClient } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'

const createPrisma = () => new PrismaClient().$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY }),
)

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrisma> | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma