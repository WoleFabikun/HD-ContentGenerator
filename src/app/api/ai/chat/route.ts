import { delegateAgent } from "@/ai/agents/delegate-example-agent"
import { contentAgent } from "@/ai/agents/contentAgent"

export const runtime = "edge"

export async function POST(request: Request): Promise<Response> {
  try {
    const { prompt } = await request.json()

    const stream = await contentAgent.completionStream({
      prompt
    })

    return new Response(stream)
  } catch (error) {
    console.error(error)
    return new Response("could not send message")
  }
}
