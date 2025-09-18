import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// GET about user info
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
        error: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// CREATE or UPDATE about user info
export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/about called')
  
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value
    if (!token) {
      console.log('❌ No authentication token')
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      console.log('✅ Token verified')
    } catch (jwtError) {
      console.log('❌ Invalid token:', getErrorMessage(jwtError))
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    await prisma.$connect()
    console.log('✅ Database connected for POST about')

    const body = await request.json()
    const { name, title, resume, bio, quote, userImg, skillCategories } = body
    console.log('📝 Request data received:', { name, title, hasSkillCategories: !!skillCategories })

    // Check if about user already exists
    const existingAboutUser = await prisma.aboutUser.findFirst()
    console.log('🔍 Existing about user:', existingAboutUser ? 'Found' : 'Not found')

    let aboutUser
    if (existingAboutUser) {
      console.log('🔄 Updating existing about user')
      // Update existing
      aboutUser = await prisma.aboutUser.update({
        where: { id: existingAboutUser.id },
        data: {
          name: name || null,
          title: title || null,
          resume: resume || null,
          bio: bio || null,
          quote: quote || null,
          userImg: userImg || null,
          skillCategories: skillCategories || []
        }
      })
    } else {
      console.log('➕ Creating new about user')
      // Create new
      aboutUser = await prisma.aboutUser.create({
        data: {
          name: name || null,
          title: title || null,
          resume: resume || null,
          bio: bio || null,
          quote: quote || null,
          userImg: userImg || null,
          skillCategories: skillCategories || []
        }
      })
    }

    console.log('✅ About user saved successfully')
    return NextResponse.json({
      message: existingAboutUser ? 'About user updated successfully' : 'About user created successfully',
      aboutUser
    })
    
  } catch (error) {
    console.error('❌ Save about user error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to save about user info',
        error: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
