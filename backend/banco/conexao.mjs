import mysql from 'mysql2/promise'

export function abrirPool(env = process.env) {
  if (!env.DB_USER || !env.DB_NAME) throw new Error('Configure DB_USER e DB_NAME no ambiente da API.')
  return mysql.createPool({
    host: env.DB_HOST || '127.0.0.1', port: Number(env.DB_PORT || 3306),
    user: env.DB_USER, password: env.DB_PASSWORD || '', database: env.DB_NAME,
    charset: 'utf8mb4', dateStrings: true, connectionLimit: 8,
  })
}

export async function transacao(pool, executar) {
  const cx = await pool.getConnection()
  try {
    await cx.beginTransaction()
    const resultado = await executar(cx)
    await cx.commit()
    return resultado
  } catch (erro) {
    await cx.rollback()
    throw erro
  } finally {
    cx.release()
  }
}
