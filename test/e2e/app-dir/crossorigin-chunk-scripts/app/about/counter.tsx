'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <main>
      <p id="about">about</p>
      <button id="count" onClick={() => setCount((c) => c + 1)}>
        {count}
      </button>
    </main>
  )
}
