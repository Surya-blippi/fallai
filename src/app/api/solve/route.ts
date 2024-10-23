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

    // Check if this is an image request
    const isImageInput = Boolean(imageUrl)

    if (isImageInput) {
      // Handle image analysis with specific instruction for math problems
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: `You are a math tutor. When you see a math problem:
                1. Identify the equation
                2. Provide a step-by-step solution
                3. Show each step clearly with explanations
                4. Highlight the final answer
                Do not describe the image - solve the math problem shown in it.`
              }
            ]
          },
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Solve this math problem step by step:" 
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