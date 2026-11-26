import { useSyncExternalStore } from 'react'
import { alterar, observar, snapshot } from '../data/banco'

// O prefixo das antigas chaves mantém a correspondência com a importação da v1.8.
export default function useDadosConta(key, inicial) {
  const chave = key.replace(/^j360_/, '')
  const valor = useSyncExternalStore(observar, () => snapshot()?.dados[chave] ?? inicial)
  return [valor, fn => alterar(chave, fn)]
}
