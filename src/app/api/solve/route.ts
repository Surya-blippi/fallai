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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are a helpful assistant that solves problems and answers questions clearly and concisely."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: text || "Please analyze this image",
            },
            ... (imageUrl ? [{
              type: "image_url",
              image_url: imageUrl
            }] : [])
          ]
        }
      ]
    })

    return NextResponse.json({ result: response.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}