import type { ReactNode } from 'react'
import { HydrationGate } from './hydration-gate'

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <HydrationGate />
        {children}
      </body>
    </html>
  )
}
