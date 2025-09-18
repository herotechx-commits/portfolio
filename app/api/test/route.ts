import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API routes are working!',
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  return NextResponse.json({ 
    message: 'POST to API routes is working!',
    timestamp: new Date().toISOString()
  })
}
