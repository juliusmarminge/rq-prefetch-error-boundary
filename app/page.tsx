import React, { Suspense } from 'react'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Pokemon } from './Pokemon'
import { makeQueryClient } from './make-query-client'
import { pokemonQuery } from './pokemon-query'
import { redirect } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'

export default async function Home(props: { searchParams: { id?: string } }) {
  const queryClient = makeQueryClient()

  const id = props.searchParams.id ? parseInt(props.searchParams.id) : 1
  void queryClient.prefetchQuery(pokemonQuery(id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <form
        action={async (form) => {
          'use server'
          const id = form.get('id')
          if (id) redirect(`/?id=${id}`)
        }}
      >
        <label>
          Enter an id (non-number to fail):
          <input name="id" placeholder={id.toString()} />
        </label>
        <button type="submit">Submit</button>
      </form>

      <ErrorBoundary
        fallback={
          <div style={{ color: 'red' }}>Error loading pokemon {id}...</div>
        }
      >
        <Suspense
          fallback={
            <div style={{ color: 'gray' }}>Loading pokemon {id}...</div>
          }
        >
          <Pokemon />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  )
}
