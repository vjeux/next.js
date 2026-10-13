import Link from 'next/link'
import { ReactNode } from 'react'

export const dynamic = 'force-dynamic'

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/" id="to-home">
            Home
          </Link>
          <Link href="/about" id="to-about">
            About
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
