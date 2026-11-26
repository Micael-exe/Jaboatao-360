import { cp, mkdtemp, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { rolldown } from 'rolldown'

const backend = fileURLToPath(new URL('../', import.meta.url))
const temporario = await mkdtemp(join(backend, '.build-'))
const destino = join(backend, 'dist')

try {
  const bundle = await rolldown({
    cwd: backend,
    input: { servidor: './servidor.mjs', migrar: './banco/migrar.mjs' },
    platform: 'node',
    external: ['mysql2/promise'],
    onwarn(aviso, emitir) {
      if (aviso.code === 'UNRESOLVED_IMPORT') throw new Error(aviso.message)
      emitir(aviso)
    },
  })
  try {
    await bundle.write({
      dir: temporario,
      format: 'esm',
      entryFileNames: '[name].mjs',
      chunkFileNames: 'compartilhado-[hash].mjs',
    })
  } finally {
    await bundle.close()
  }
  // A migração resolve os arquivos SQL em relação a import.meta.url.
  await cp(join(backend, 'banco', 'migracoes'), join(temporario, 'migracoes'), { recursive: true })
  await rm(destino, { recursive: true, force: true })
  await rename(temporario, destino)
  console.log('Build do backend gerado em dist/.')
} finally {
  await rm(temporario, { recursive: true, force: true })
}
