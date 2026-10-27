import {
  version as version1,
  value as value1,
} from './node_modules/.pnpm/pkg@1.0.0/node_modules/pkg/index.js'
import {
  version as version2,
  value as value2,
} from './node_modules/.pnpm/pkg@2.0.0/node_modules/pkg/index.js'
import * as ns1 from './node_modules/.pnpm/pkg@1.0.0/node_modules/pkg/index.js'
import * as ns2 from './node_modules/.pnpm/pkg@2.0.0/node_modules/pkg/index.js'

// Both modules have the same path after their last `node_modules/`
// (`pkg/index.js`), so the readable part of the variables holding their
// namespaces is the same. They must still be different variables.
it('keeps imports of modules with the same package-relative path apart', () => {
  expect(version1).toBe('1.0.0')
  expect(version2).toBe('2.0.0')
  expect(value1()).toBe(1)
  expect(value2()).toBe(2)
})

it('keeps namespace imports of those modules apart', () => {
  expect(ns1.version).toBe('1.0.0')
  expect(ns2.version).toBe('2.0.0')
  expect(ns1.value()).toBe(1)
  expect(ns2.value()).toBe(2)
})
