import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('crossorigin chunk scripts', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('carries the crossOrigin on every chunk script a client navigation renders', async () => {
    const browser = await next.browser('/')
    await browser.elementByCss('#to-about').click()
    await retry(async () => {
      expect(await browser.elementByCss('#about').text()).toBe('about')
    })

    // Every <script> for a chunk, the loader's and React's hoistable alike,
    // names the same CORS mode; the hoistable without it was a second cache
    // key and a second download of the same chunk.
    const scripts: { src: string; crossOrigin: string | null }[] =
      await browser.eval(`
        Array.from(document.querySelectorAll('script[src*="/_next/static/"][src$=".js"]'))
          .map((script) => ({
            src: new URL(script.getAttribute('src'), location.href).pathname,
            crossOrigin: script.getAttribute('crossorigin'),
          }))
      `)
    expect(scripts.length).toBeGreaterThan(0)
    for (const script of scripts) {
      expect(script.crossOrigin).not.toBeNull()
    }

    // No chunk reached the network twice for the navigation.
    const downloadedTwice: string[] = await browser.eval(`
      (() => {
        const counts = new Map()
        for (const entry of performance.getEntriesByType('resource')) {
          const url = new URL(entry.name)
          if (!url.pathname.includes('/_next/static/') || !url.pathname.endsWith('.js')) continue
          if (entry.transferSize === 0) continue
          counts.set(url.pathname, (counts.get(url.pathname) ?? 0) + 1)
        }
        return Array.from(counts).filter(([, n]) => n > 1).map(([path]) => path)
      })()
    `)
    expect(downloadedTwice).toEqual([])
  })
})
