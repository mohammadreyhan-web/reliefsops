import { generateText, gateway } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()
    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'A question is required.' }, { status: 400 })
    }

    const result = await generateText({
      model: gateway.languageModel('openai/o4-mini'),
      system: `You are ReliefOps Copilot, a careful disaster-relief operations assistant. Give concise, practical guidance based only on the supplied operational snapshot. Never invent live facts, approve requests, dispatch resources, or make decisions on behalf of authorized staff. Clearly label recommendations as recommendations. If data is missing, say so.\n\nOperational snapshot:\n${JSON.stringify(context)}`,
      prompt: message.trim(),
      maxOutputTokens: 500,
    })

    return NextResponse.json({ answer: result.text })
  } catch (error) {
    console.error('[v0] Copilot request failed:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'The copilot is temporarily unavailable. Please try again.' }, { status: 503 })
  }
}
