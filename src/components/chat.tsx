"use client"

import { useState } from "react"

import { useChatStream } from "@hackdance/agents-hooks"
import { FloatingChat } from "@/components/floating-chat"
import { PromptComposer } from "@/components/prompt-composer"

export function Chat() {
  const [prompt, setPrompt] = useState("")
  const [loading, setIsLoading] = useState(false)

  const { startStream, messages } = useChatStream({
    startingMessages: []
  })

  const sendMessage = async () => {
    if (!prompt.length || loading) return

    setIsLoading(true)
    setPrompt("")

    try {
      startStream({
        prompt,
        url: "/api/ai/chat"
      })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPrompt(event.target.value ?? "")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault() // Prevent the default newline behavior of the Enter key
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col max-h-full">
      <div className="max-h-full overflow-y-auto flex-1 px-12 py-8">
        <FloatingChat messages={messages} />
      </div>

      <PromptComposer
        loading={loading}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onSubmit={sendMessage}
        prompt={prompt}
      />
    </div>
  )
}
