import { NextRequest, NextResponse } from 'next/server'
import { chatWithAI } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, context } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    if (messages.length > 20) {
      return NextResponse.json({ error: 'Too many messages' }, { status: 400 })
    }

    const response = await chatWithAI(messages, context)
    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}
