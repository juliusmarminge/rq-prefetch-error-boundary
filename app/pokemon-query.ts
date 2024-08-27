import { queryOptions } from '@tanstack/react-query'
import type { PokeAPI } from 'pokeapi-types'

async function withMinimumDelay<T>(ms: number, promise: Promise<T>) {
  const [result] = await Promise.all([
    promise,
    new Promise<void>((resolve) => setTimeout(resolve, ms)),
  ])
  return result
}

async function fetchPokemon(id: number) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (response.status !== 200) {
    throw new Error('Failed to fetch pokemon', { cause: response })
  }
  const data = await response.json()
  return data as PokeAPI.Pokemon
}

export const pokemonQuery = (id: number) =>
  queryOptions({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      return withMinimumDelay(1000, fetchPokemon(id))
    },
    retry: false,
  })
