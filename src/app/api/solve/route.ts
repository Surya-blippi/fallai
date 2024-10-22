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

    if (imageUrl) {
      // Handle image input
      // Check if it's a base64 image
      const isBase64Image = imageUrl.startsWith('data:image')
      const imageUrlToSend = isBase64Image 
        ? imageUrl  // Use base64 string directly if it's already in base64
        : {         // Use URL if it's an external image
            url: imageUrl,
            detail: "low"
          }

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: text || "Please analyze this image and provide a detailed explanation:" 
              },
              {
                type: "image_url",
                image_url: imageUrlToSend
              }
            ]
          }
        ]
      })

      return NextResponse.json({ result: response.choices[0].message.content })

    } else {
      // Handle text-only input
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a helpful assistant that provides clear and detailed answers."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: text
              }
            ]
          }
        ]
      })

      return NextResponse.json({ result: response.choices[0].message.content })
    }

  } catch (error: unknown) {
    console.error('Error:', error)
    
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