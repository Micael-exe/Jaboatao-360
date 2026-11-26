import assert from 'node:assert/strict'
import { createServer, request } from 'node:http'
import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { caminho, criarVerificador } from './verificar-email.mjs'

const credenciais = { ABSTRACT_API_KEY: 'chave-de-teste' }
const emailTeste = 'pessoa+guia@example.com'

function resultado(status, detalhe, extras = {}) {
  return Response.json({
    email_address: emailTeste,
    email_deliverability: { status, status_detail: detalhe, is_smtp_valid: status === 'deliverable' },
    ...extras,
  })
}

async function cliente(t, consultar, ambiente = credenciais) {
  const servidor = createServer(criarVerificador(ambiente, consultar))
  const nome = 'j360-' + randomUUID()
  const socketPath = process.platform === 'win32' ? '\\\\.\\pipe\\' + nome : join(tmpdir(), nome)
  await new Promise((resolve, reject) => servidor.once('error', reject).listen(socketPath, resolve))
  t.after(() => new Promise(resolve => servidor.close(resolve)))
  return (email = emailTeste, opcoes = {}) => new Promise((resolve, reject) => {
    const { body = JSON.stringify({ email }), ...http } = opcoes
    const req = request({
      socketPath, path: caminho, method: 'POST', headers: { 'Content-Type': 'application/json' }, ...http,
    }, async res => {
      const partes = []
      for await (const parte of res) partes.push(parte)
      resolve({ status: res.statusCode, json: () => JSON.parse(Buffer.concat(partes).toString()) })
    })
    req.on('error', reject)
    req.end(http.method === 'GET' ? undefined : body)
  })
}

for (const [status, detalhe, esperado] of [
  ['deliverable', 'valid_email', 'valido'],
  ['undeliverable', 'invalid_mailbox', 'invalido'],
  ['undeliverable', 'full_mailbox', 'inconclusivo'],
  ['undeliverable', 'unavailable_server', 'inconclusivo'],
  ['unknown', null, 'inconclusivo'],
]) {
  test('traduz ' + (detalhe ?? status), async t => {
    const consultar = t.mock.fn(async (url, opcoes) => {
      assert.equal(url, 'https://emailreputation.abstractapi.com/v1/')
      assert.equal(opcoes.method, 'POST')
      assert.equal(opcoes.headers.Authorization, 'Bearer chave-de-teste')
      assert.equal(opcoes.headers['Content-Type'], 'application/json')
      assert.deepEqual(JSON.parse(opcoes.body), { email: emailTeste })
      return resultado(status, detalhe)
    })
    const post = await cliente(t, consultar)
    const resposta = await post()
    assert.equal(resposta.status, 200)
    assert.deepEqual(await resposta.json(), { estado: esperado })
    assert.equal(consultar.mock.callCount(), 1)
  })
}

test('mantém inconclusivos o domínio catch-all e a caixa sem confirmação SMTP', async t => {
  for (const extras of [
    { email_quality: { is_catchall: true } },
    { email_deliverability: { status: 'deliverable', is_smtp_valid: false } },
    { email_deliverability: { status: 'deliverable' } },
  ]) {
    const post = await cliente(t, () => resultado('deliverable', 'valid_email', extras))
    assert.deepEqual(await (await post()).json(), { estado: 'inconclusivo' })
  }
})

test('falhas do serviço e respostas inconsistentes não aprovam o endereço', async t => {
  for (const consultar of [
    () => { throw new Error('rede') },
    ...[401, 403, 422, 429, 503].map(status => () => new Response(null, { status })),
    () => new Response('invalid JSON'),
    () => Response.json({}),
    () => resultado('deliverable', 'valid_email', { email_address: 'outro@example.com' }),
    () => resultado('inesperado'),
  ]) {
    const post = await cliente(t, consultar)
    const resposta = await post()
    assert.equal(resposta.status, 503)
    assert.deepEqual(await resposta.json(), { estado: 'indisponivel' })
  }
})

test('exige a chave antes de consultar o provedor', async t => {
  const consultar = t.mock.fn()
  const post = await cliente(t, consultar, {})
  assert.equal((await post()).status, 503)
  assert.equal(consultar.mock.callCount(), 0)
})

test('rejeita entradas inválidas antes de consultar o serviço', async t => {
  const consultar = t.mock.fn()
  const post = await cliente(t, consultar)
  assert.deepEqual(await (await post('nome@@example.com')).json(), { estado: 'invalido' })
  assert.equal((await post('', { body: '{' })).status, 400)
  assert.equal((await post('x'.repeat(3000))).status, 413)
  assert.equal((await post('', { headers: { 'Content-Type': 'text/plain' } })).status, 415)
  assert.equal((await post('', { method: 'GET', body: undefined })).status, 405)
  assert.equal(consultar.mock.callCount(), 0)
})

test('limita o número de consultas por origem', async t => {
  const consultar = t.mock.fn(() => resultado('deliverable', 'valid_email'))
  const post = await cliente(t, consultar)
  for (let i = 0; i < 10; i++) assert.equal((await post()).status, 200)
  assert.equal((await post()).status, 429)
  assert.equal(consultar.mock.callCount(), 10)
})
