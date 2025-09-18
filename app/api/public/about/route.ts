import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  console.log('🔍 GET /api/about called')
  
  try {
    await prisma.$connect()
    console.log('✅ Database connected for GET about')

    // Get the first (and should be only) about user record
    const aboutUser = await prisma.aboutUser.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    })

    console.log('📊 About user found:', aboutUser ? 'Yes' : 'No')

    if (!aboutUser) {
      console.log('❌ No about user record found')
      return NextResponse.json(
        { message: 'About user info not found' },
        { status: 404 }
      )
    }

    console.log('✅ Returning about user data')
    return NextResponse.json({ aboutUser })
    
  } catch (error) {
    console.error('❌ Get about user error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to fetch about user info',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}