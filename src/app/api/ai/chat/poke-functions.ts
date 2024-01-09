// Import necessary modules or libraries here
import { createFunctionDefinition } from '@hackdance/agents';
import axios from 'axios';
import { z } from 'zod'; // Import 'z' from the 'zod' library


// Function to fetch Pokémon details by name or ID from the PokeAPI
async function fetchPokemonDetails(nameOrId: string | number): Promise<any> {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon details:', error);
    throw new Error('Failed to fetch Pokémon details');
  }
}

// Function definition to get games a Pokémon can be found in
export const getGamesForPokemon = createFunctionDefinition({
  name: "Get Games for Pokémon",
  description: "Retrieve games in which a Pokémon can be found.",
  paramsSchema: z.string(), // Assuming the parameter is a Pokémon name or ID
  execute: async (pokemonNameOrId: string) => {
    try {
      const pokemonData = await fetchPokemonDetails(pokemonNameOrId);
      const games = pokemonData?.game_indices?.map((index: any) => index?.version?.name);
      return games || [];
    } catch (error) {
      console.error('Error getting games for Pokémon:', error);
      throw new Error('Failed to get games for Pokémon');
    }
  }
});

// Function definition to get moves a Pokémon can use
export const getMovesForPokemon = createFunctionDefinition({
  name: "Get Moves for Pokémon",
  description: "Retrieve moves that a Pokémon can use.",
  paramsSchema: z.string(), // Assuming the parameter is a Pokémon name or ID
  execute: async (pokemonNameOrId: string) => {
    try {
      const pokemonData = await fetchPokemonDetails(pokemonNameOrId);
      const moves = pokemonData?.moves?.map((move: any) => move?.move?.name);
      return moves || [];
    } catch (error) {
      console.error('Error getting moves for Pokémon:', error);
      throw new Error('Failed to get moves for Pokémon');
    }
  }
});

// Function definition to get encounter methods for a Pokémon
export const getEncounterMethodsForPokemon = createFunctionDefinition({
  name: "Get Encounter Methods for Pokémon",
  description: "Retrieve methods by which a player might encounter a Pokémon in the wild.",
  paramsSchema: z.string(), // Assuming the parameter is a Pokémon name or ID
  execute: async (pokemonNameOrId: string) => {
    try {
      const pokemonData = await fetchPokemonDetails(pokemonNameOrId);
      const speciesURL = pokemonData?.species?.url;
      if (!speciesURL) throw new Error('Species URL not found for Pokémon');

      const speciesData = await axios.get(speciesURL);
      const encounterMethods = speciesData?.data?.encounter_methods?.map((method: any) => method?.method?.name);
      return encounterMethods || [];
    } catch (error) {
      console.error('Error getting encounter methods for Pokémon:', error);
      throw new Error('Failed to get encounter methods for Pokémon');
    }
  }
});
