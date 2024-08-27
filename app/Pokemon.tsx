'use client'

import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { pokemonQuery } from './pokemon-query'
import { useSearchParams } from 'next/navigation'

export function Pokemon() {
  const search = useSearchParams()
  const id = search.get('id')

  const query = useSuspenseQuery(pokemonQuery(id ? parseInt(id) : 1))

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'start',
      }}
    >
      {query.data.name}
      <img src={query.data.sprites.front_default} alt={query.data.name} />
    </div>
  )
}
