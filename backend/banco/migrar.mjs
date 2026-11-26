import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { abrirPool } from './conexao.mjs'
import { catalogo } from '../../frontend/src/data/dados.js'

const pasta = new URL('./migracoes/', import.meta.url)

export async function migrar(pool, ate = Infinity) {
  const cx = await pool.getConnection()
  const [[{ nome }]] = await cx.query('SELECT DATABASE() AS nome')
  const trava = 'j360:' + createHash('sha256').update(nome).digest('hex').slice(0, 48)
  try {
    const [[{ obtida }]] = await cx.execute('SELECT GET_LOCK(?,30) AS obtida', [trava])
    if (obtida !== 1) throw new Error('Outra migração está em execução.')
    await cx.query(`CREATE TABLE IF NOT EXISTS migracoes (
      versao VARCHAR(128) PRIMARY KEY, checksum CHAR(64) NOT NULL,
      aplicada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`)
    const arquivos = (await readdir(pasta)).filter(n => /^\d+_.*\.sql$/.test(n)).sort()
    for (const nome of arquivos) {
      if (parseInt(nome) > ate) break
      const sql = (await readFile(new URL(nome, pasta), 'utf8')).replace(/\r\n/g, '\n')
      const hash = createHash('sha256').update(sql).digest('hex')
      const [[anterior]] = await cx.execute('SELECT checksum FROM migracoes WHERE versao=?', [nome])
      if (anterior) {
        if (anterior.checksum !== hash) throw new Error('Migração já aplicada foi alterada: ' + nome)
        continue
      }
      // Cada instrução termina com ponto e vírgula no fim da linha.
      const comandos = sql.replace(/^\s*--.*$/gm, '').split(/;[ \t]*(?:\n|$)/)
      for (const comando of comandos) if (comando.trim()) await cx.query(comando)
      await cx.execute('INSERT INTO migracoes (versao,checksum) VALUES (?,?)', [nome, hash])
    }
    for (const local of catalogo) {
      await cx.execute('INSERT INTO locais (id,nome,origem) VALUES (?,?,?) ON DUPLICATE KEY UPDATE nome=?, origem=?',
        [local.id,local.nome,local.origem,local.nome,local.origem])
    }
  } finally {
    try { await cx.execute('SELECT RELEASE_LOCK(?)', [trava]) } finally { cx.release() }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pool = abrirPool()
  try { await migrar(pool); console.log('Banco atualizado.') } finally { await pool.end() }
}
