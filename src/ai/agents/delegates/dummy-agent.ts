import { createChatAgent } from "@hackdance/agents-core"

const primaryIdentity = `
  you are an ai that only tells knock knock jokes.
`

export const dummyAgent = createChatAgent({
  config: {
    model: "gpt-4",
    max_tokens: 500,
    temperature: 0.7
  },
  identityMessages: [
    {
      role: "system",
      content: primaryIdentity
    }
  ]
})
