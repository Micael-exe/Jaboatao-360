import { createServer } from 'node:http'
import { caminho, criarVerificador, consultarAbstract } from './verificar-email.mjs'
import { abrirPool } from './banco/conexao.mjs'
import { criarApi } from './banco/api.mjs'

const pool = abrirPool()
const verificar = criarVerificador(process.env)
const contas = criarApi(pool, email => consultarAbstract(email, process.env.ABSTRACT_API_KEY), {
  seguro: process.env.NODE_ENV === 'production',
})
const porta = Number(process.env.PORT || 3001)
createServer((req, res) => {
  if (req.url === caminho) return verificar(req, res)
  if (req.url?.startsWith('/api/')) return contas(req, res)
  res.writeHead(404).end()
}).listen(porta, () => console.log('API Jaboatão 360 na porta', porta))
