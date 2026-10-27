import { nextTestSetup } from 'e2e-utils'
import { retry, waitFor } from 'next-test-utils'

describe('app-hydration-deferred-value', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  // While hydration is suspended inside the root layout, React must wait for
  // the data. It used to commit about once per millisecond instead: the
  // router's `useDeferredValue` calls, given the final value as their initial
  // value when there is no prefetch data, spawned a deferred render that
  // committed nothing and made React retry the hydration at once.
  it('does not commit in a loop while hydration is suspended', async () => {
    const browser = await next.browser('/', {
      waitHydration: false,
      async beforePageLoad(page) {
        // Count the commits of every React root on the page.
        await page.addInitScript(() => {
          const state = { injected: false, commits: 0 }
          ;(window as any).__hydrationCommits = state
          ;(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
            supportsFiber: true,
            renderers: new Map(),
            inject() {
              state.injected = true
              return 1
            },
            onScheduleFiberRoot() {},
            onCommitFiberRoot() {
              state.commits++
            },
            onCommitFiberUnmount() {},
            onPostCommitFiberRoot() {},
            checkDCE() {},
          }
        })
      },
    })

    await retry(async () => {
      expect(await browser.eval('window.__hydrationCommits.injected')).toBe(
        true
      )
      expect(await browser.eval('window.__hydrationWaiting === true')).toBe(
        true
      )
    })
    const commitsBefore = await browser.eval(
      'window.__hydrationCommits.commits'
    )
    await waitFor(1000)
    const commitsWhileSuspended =
      (await browser.eval('window.__hydrationCommits.commits')) - commitsBefore
    expect(await browser.elementByCss('#gate').text()).toBe('server')

    await browser.eval('window.__releaseHydration()')
    await retry(async () => {
      expect(await browser.elementByCss('#gate').text()).toBe('hydrated')
    })
    expect(await browser.elementByCss('#page').text()).toBe('hello world')

    // A few commits are fine (the dev overlay renders in its own root); the
    // loop commits thousands of times per second.
    expect(commitsWhileSuspended).toBeLessThan(20)
  })
})
