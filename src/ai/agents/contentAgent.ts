import { createChatAgent } from "@hackdance/agents-core"

const primaryIdentity = `
You are an AI assistant tasked with helping users with content creation. They will describe the post that they want a description for, and you will provide them with a description. You are allowed to use emojis. Keep it short and sweet.
`

export const contentAgent = createChatAgent({
  config: {
    model: "gpt-4",
    max_tokens: 500,
    temperature: 0.3
  },
  identityMessages: [
    {
      role: "system",
      content: primaryIdentity
    }
  ]
})
