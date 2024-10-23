// src/app/api/solve/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

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
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `You are a math tutor. For any math problem:
                1. Use proper LaTeX formatting for all mathematical expressions
                2. Format steps clearly with markdown headers
                3. Use align environment for equation steps
                4. Use proper mathematical notation (\frac, \times, etc.)
                5. Box the final answer using \boxed
                6. Include verification when applicable
                Ensure all LaTeX is properly escaped and formatted.`
              }
            ]
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Solve this math problem with proper LaTeX formatting:" 
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
      return NextResponse.json(
        { error: (error as {message: string}).message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}