import { omit } from "ramda"
import z from "zod"

import { createFunctionDefinition, createSchemaAgent } from "@hackdance/agents-core"
import { dummyAgent } from "./delegates/dummy-agent"
import { pokeAgent } from "./delegates/pokeAgent"

export const delegateAgentSchema = z.object({
  content: z.string(),
  delegates: z.string()
})

export const executeJoke = async (prompt: string) => {
  const stream = await dummyAgent.completionStream({
    prompt
  })
  return new Response(stream)
}

export const executePoke = async (prompt: string) => {
  const stream = await pokeAgent.completionStream({
    prompt
  })
  return new Response(stream)
}

export const functionDefinition = createFunctionDefinition({
  name: "Delegate Agent",
  description: "An agent that delegates to other agents",
  paramsSchema: z.object({
    prompt: z.string()
  }),
  execute: async ({ prompt }) => {
    const stream = await delegateAgent.completionStream({
      prompt
    })
    return new Response(stream)
  }
})

export const delegates = {
  dummyAgent: {
    capability: "Can tell jokes.",
    promptFormat: "A question asking to be told a joke.",
    requiredContext: "Request to be told a joke",
    contextForCore: true,
    function: executeJoke,
    url: "/api/ai/delegates/dummy-agent",
    parser: (response: string) => {
      return response
    }
  },
  pokeAgent: {
    capability: "Can tell you about pokemon.",
    promptFormat: "A question asking about a pokemon.",
    requiredContext: "A pokemon name",
    contextForCore: true,
    function: executePoke,
    url: "/api/ai/delegates/pokeAgent",
    parser: (response: string) => {
      return response
    }
  }
}

const primaryIdentity = `
  You are an example ai agent, that is knowedgable about everything. etc etc..

  You have a number of delegates that you can use to help you answer questions or that can provide
  the user with additional information. Each of those delegates will have a description of their
  capabilities, a format for the prompt that they expect, and a required context that they need to
  be able to answer questions, they will also have a flag for wether or not their response will be
  returned to you in a follow up message or used only for providing context directly to the user.
  If that flag is set to true, you will need to call the function given in that delegates function with the prompt from the user and return the response.

  ${JSON.stringify(omit(["url","parser"], delegates))}

  No matter if you decide to delegate out to one or more agents for additional context, you will be the only agent communicating with the user, so you will need to be able to
  communicate the results of the other agents to the user in a way that makes sense. You will take their output and summarize in a concise manner and if the user has follow ups you
  can elaborate or decide to delegate again.

  The user should not be aware of the other agents, and should only be aware of you.

  When responding, you will provide a json object with 2 keys, "content" (your response to the user)
  and "delegates" (a map of agent name to a list of prompts for that agent to use based on current user query and the response from that agents parser),
  You will provide the delegates map as a fully escaped json string.
`

export const delegateAgent = createSchemaAgent({
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
  ],
  schema: delegateAgentSchema
})
