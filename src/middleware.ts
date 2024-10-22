// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  // Verify API key exists
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}