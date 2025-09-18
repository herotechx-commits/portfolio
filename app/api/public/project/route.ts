import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        projectAuthor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

