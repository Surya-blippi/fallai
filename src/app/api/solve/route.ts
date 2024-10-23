// src/app/api/solve/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface OpenAIError {
  message: string;
  type?: string;
  code?: string;
  param?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { text, imageUrl } = body

    // Check if this is an image request
    const isImageInput = Boolean(imageUrl)

    if (isImageInput) {
      // Handle image analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: text || "What's in this image?" 
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ]
      });
      
      return NextResponse.json({ result: response.choices[0].message.content })
    } else {
      // Handle text-only input
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: text
          }
        ]
      });

      return NextResponse.json({ result: response.choices[0].message.content })
    }

  } catch (error: unknown) {
    console.error('API Error:', error)
    
    if (error && typeof error === 'object' && 'message' in error) {
      const openAIError = error as OpenAIError
      return NextResponse.json(
        { error: openAIError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}