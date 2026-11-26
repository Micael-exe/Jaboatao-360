const endpoint = 'https://emailreputation.abstractapi.com/v1/'
export const caminho = '/api/verificar-email'

function responder(res, codigo, estado) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify({ estado }))
}

export async function consultarAbstract(email, chave, consultar = fetch) {
  if (!chave?.trim()) return 'indisponivel'
  const resposta = await consultar(endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + chave,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email }),
    redirect: 'error',
    signal: AbortSignal.timeout(20000),
  })
  if (resposta.status !== 200) {
    await resposta.body?.cancel()
    return 'indisponivel'
  }

  const dados = await resposta.json()
  if (dados.email_address !== email) return 'indisponivel'
  const entrega = dados.email_deliverability
  switch (entrega?.status) {
    case 'deliverable':
      return dados.email_quality?.is_catchall === true || entrega.is_smtp_valid !== true
        ? 'inconclusivo' : 'valido'
    case 'undeliverable':
      // Uma caixa cheia ou um servidor fora do ar pode voltar a receber mensagens.
      return ['full_mailbox', 'unavailable_server'].includes(entrega.status_detail)
        ? 'inconclusivo' : 'invalido'
    case 'unknown': return 'inconclusivo'
    default: return 'indisponivel'
  }
}

export function criarVerificador({ ABSTRACT_API_KEY: chave }, consultar = fetch) {
  // Limites por processo: mantêm a cota do provedor sob controle mesmo atrás de um proxy.
  const porOrigem = new Map()
  let inicio = Date.now()
  let total = 0

  return async function verificar(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return responder(res, 405, 'metodo_invalido')
    }
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
      return responder(res, 415, 'conteudo_invalido')
    }
    let email
    try {
      const partes = []
      let tamanho = 0
      for await (const parte of req) {
        tamanho += parte.length
        if (tamanho > 2048) return responder(res, 413, 'conteudo_invalido')
        partes.push(parte)
      }
      email = JSON.parse(Buffer.concat(partes).toString()).email
    } catch {
      return responder(res, 400, 'conteudo_invalido')
    }
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
      return responder(res, 200, 'invalido')
    }
    if (!chave?.trim()) return responder(res, 503, 'indisponivel')

    if (Date.now() - inicio >= 60000) {
      inicio = Date.now()
      total = 0
      porOrigem.clear()
    }
    const origem = req.socket.remoteAddress
    const tentativas = porOrigem.get(origem) ?? 0
    if (tentativas >= 10 || total >= 100) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((inicio + 60000 - Date.now()) / 1000))))
      return responder(res, 429, 'limite')
    }
    porOrigem.set(origem, tentativas + 1)
    total++

    try {
      const estado = await consultarAbstract(email, chave, consultar)
      return responder(res, estado === 'indisponivel' ? 503 : 200, estado)
    } catch {
      // Uma falha de rede não determina se o endereço existe.
    }
    return responder(res, 503, 'indisponivel')
  }
}
