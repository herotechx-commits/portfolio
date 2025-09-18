import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  console.log('🚀 Signup API called')
  
  try {
    // Test database connection first
    await prisma.$connect()
    console.log('✅ Database connected')

    const contentType = request.headers.get('content-type')
    console.log('📋 Content-Type:', contentType)

    if (!contentType || !contentType.includes('application/json')) {
      console.log('❌ Invalid content type')
      return NextResponse.json(
        { message: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    let body
    try {
      body = await request.json()
      console.log('📝 Request body received:', { ...body, password: '[HIDDEN]' })
    } catch (error) {
      console.log('❌ JSON parse error:', error)
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { email, password, name } = body

    // Validation
    if (!email || !password || !name) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('❌ Password too short')
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format')
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking if user exists...')
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      console.log('❌ User already exists')
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      )
    }

    console.log('🔐 Hashing password...')
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('👤 Creating user...')
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })

    console.log('✅ User created successfully:', { id: user.id, email: user.email })

    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })

  } catch (error) {
    console.error('💥 Signup error:', error)
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      )
    }
    
    if (error.code === 'P1001') {
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
