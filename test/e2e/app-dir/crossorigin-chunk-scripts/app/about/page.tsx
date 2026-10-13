import { Counter } from './counter'

export default async function About() {
  // A dynamic page with a client chunk of its own: the navigation's Flight
  // payload names the chunk, the bundler's loader fetches it, and the
  // rendered segment carries a hoistable <script> for the same URL.
  await Promise.resolve()
  return <Counter />
}
