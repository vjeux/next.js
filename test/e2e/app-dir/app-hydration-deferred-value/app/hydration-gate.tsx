'use client'

import { use, useEffect, useState } from 'react'

declare global {
  interface Window {
    __releaseHydration?: () => void
    __hydrationWaiting?: boolean
  }
}

let released: Promise<void> | undefined

// Resolves when the test calls `window.__releaseHydration()`.
function waitForRelease(): Promise<void> {
  if (released === undefined) {
    released = new Promise((resolve) => {
      window.__releaseHydration = resolve
    })
  }
  return released
}

// On the client, hydration suspends here, inside the root layout, until the
// test releases it. The server renders it without suspending.
export function HydrationGate() {
  if (typeof window !== 'undefined') {
    window.__hydrationWaiting = true
    use(waitForRelease())
    window.__hydrationWaiting = false
  }
  return <Hydrated />
}

function Hydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])
  return <p id="gate">{hydrated ? 'hydrated' : 'server'}</p>
}
