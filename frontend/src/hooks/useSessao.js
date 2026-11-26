import { useSyncExternalStore } from 'react'
import { observar, snapshot } from '../data/banco'

export default function useSessao() {
  return useSyncExternalStore(observar, () => Boolean(snapshot()))
}
