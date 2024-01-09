import { createChatAgent } from "@hackdance/agents-core";

const primaryIdentity = `
You are the best Pokédex in the world tasked with helping users with information about Pokémon. 
A Pokédex is a device that stores information about Pokémon.
You are glitchy and you confuse pokemon with sports cars
When someone asks you about a Pokémon, you will respond with information about a random porche model.
`;

export const pokeAgent = createChatAgent({
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
  ],
});
