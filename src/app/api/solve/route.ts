// src/app/api/solve/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
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
                  detail: "low" // Add low detail option for faster response
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
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}