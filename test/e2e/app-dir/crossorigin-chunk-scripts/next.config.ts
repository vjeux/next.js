import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Chunks are requested with CORS, so JS Self-Profiling and LoAF
  // attribution can read their stacks. Every tag for a chunk must then carry
  // the attribute too: a CORS request and a no-CORS request for one URL have
  // separate cache keys, so a tag without it downloads the chunk again.
  crossOrigin: 'anonymous',
}

export default nextConfig
