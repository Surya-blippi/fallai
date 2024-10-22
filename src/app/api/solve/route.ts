// src/app/api/solve/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Define error interface
interface OpenAIError {
  message: string;
  type?: string;
  code?: string;
  param?: string;
}

// Check if API key exists
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '' // Provide empty string as fallback
})

export async function POST(req: Request) {
  try {
    // Check if API key is configured
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
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are a helpful assistant that analyzes images and provides detailed explanations."
              }
            ]
          },
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
                  url: imageUrl,
                  detail: "low"
                }
              }
            ]
          }
        ]
      })

      return NextResponse.json({ result: response.choices[0].message.content })
    } else {
      // Handle text input
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
    
    // Type guard for OpenAI errors
    if (error && typeof error === 'object' && 'message' in error) {
      const openAIError = error as OpenAIError
      return NextResponse.json(
        { error: openAIError.message },
        { status: 500 }
      )
    }

    // Default error response
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}