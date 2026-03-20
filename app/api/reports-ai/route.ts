import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-5-mini',
    system: `You are MATpad AI, an intelligent assistant for educational data analysis.
You help users understand their school data, reports, attendance figures, attainment metrics, and other educational insights.
Be helpful, concise, and provide actionable insights when analysing data.
Use British English spelling (e.g., "analyse" not "analyze", "behaviour" not "behavior").`,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
