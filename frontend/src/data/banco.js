// Um retrato da conta em memória. O servidor identifica o dono pelo cookie HttpOnly.
let atual = null
let confirmado = null
let pendentes = {}
let gravacao
let geracao = 0
let mensagem = ''
const ouvintes = new Set()
export const observar = fn => { ouvintes.add(fn); return () => ouvintes.delete(fn) }
export const snapshot = () => atual
export const versaoDaConta = () => geracao
export const aviso = () => mensagem
const avisar = () => ouvintes.forEach(fn => fn())
export function informar(texto) { mensagem = texto; avisar() }

async function pedir(url, metodo = 'GET', corpo, signal) {
  const prazo = AbortSignal.timeout(30000)
  const cancelar = signal ? AbortSignal.any([signal, prazo]) : prazo
  let r
  try {
    r = await fetch(url, { method: metodo, credentials: 'same-origin', cache: 'no-store', signal: cancelar,
      ...(corpo && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }) })
  } catch { throw new Error('Não foi possível conectar ao servidor. Tente novamente.') }
  let dados
  try { dados = await r.json() } catch { throw new Error('O serviço de contas está indisponível.') }
  if (!r.ok) throw Object.assign(new Error(dados?.mensagem || 'O servidor não confirmou a alteração.'),{status:r.status})
  return dados
}

export function receberConta(conta) {
  geracao++
  atual = confirmado = conta
  pendentes = {}
  mensagem = ''
  avisar()
}
export async function carregarSessao() {
  if (gravacao) await gravacao
  const versao = geracao
  try {
    const s = await pedir('/api/sessao')
    if (versao !== geracao || gravacao) return
    if (s && s.contaId === atual?.contaId && s.revisao < atual.revisao) return
    if (s?.contaId !== atual?.contaId || s?.revisao !== atual?.revisao || mensagem) receberConta(s)
  } catch (e) { if (versao===geracao) informar(e.message) }
}

function avisarAbas() {
  try { localStorage.setItem('j360_evento', crypto.randomUUID()) } catch { /* Cookie continua válido. */ }
}
export async function autenticar(acao,dados,signal) {
  await aguardarGravacao()
  const s = await pedir('/api/'+acao,'POST',dados,signal)
  if (signal?.aborted) return
  receberConta(s)
  avisarAbas()
}
export async function sair() {
  await aguardarGravacao()
  await pedir('/api/sair','POST',{})
  receberConta(null)
  avisarAbas()
}

async function enviarPendentes(versao) {
  while (Object.keys(pendentes).length && geracao===versao) {
    const lote=pendentes
    pendentes={}
    try {
      const { revisao } = await pedir('/api/dados','PATCH',{contaId:atual.contaId,revisao:confirmado.revisao,alteracoes:lote})
      if (geracao!==versao) return
      confirmado={...confirmado,revisao,dados:{...confirmado.dados,...lote}}
      atual={...atual,revisao}
      avisar()
    } catch (e) {
      if (geracao!==versao) return
      pendentes={}
      atual=confirmado
      if (e.status===401) receberConta(null)
      if (e.status===409) {
        try { receberConta(await pedir('/api/sessao')) } catch { /* última revisão confirmada */ }
      }
      informar(e.message)
      throw e
    }
  }
}
export function alterar(chave,fn) {
  if (!atual) return
  const valor=typeof fn==='function' ? fn(atual.dados[chave]) : fn
  atual={...atual,dados:{...atual.dados,[chave]:valor}}
  pendentes[chave]=valor
  mensagem=''
  if (!gravacao) {
    const versao=geracao
    gravacao=Promise.resolve().then(()=>enviarPendentes(versao)).finally(()=>{ gravacao=undefined })
    // Edições automáticas exibem falhas no aviso global. Botões de salvar também aguardam esta promessa.
    gravacao.catch(()=>{})
  }
  avisar()
}
export const aguardarGravacao = () => gravacao ?? Promise.resolve()
export function acompanharNavegador() {
  const sincronizar=()=>carregarSessao().catch(()=>{})
  window.addEventListener('storage',e=>{ if (e.key==='j360_evento' || !e.key) sincronizar() })
  window.addEventListener('focus',sincronizar)
  window.addEventListener('beforeunload',e=>{ if (gravacao) { e.preventDefault(); e.returnValue='' } })
}

export function contaAntiga(email) {
  try {
    const antiga=JSON.parse(localStorage.getItem('j360_conta'))
    if (email && antiga?.email?.trim().toLowerCase()===email.trim().toLowerCase()) return antiga
  } catch { /* O navegador pode estar sem dados utilizáveis. */ }
  return null
}
export function lerLegado(email) {
  if (!contaAntiga(email)) return null
  const dados={}
  for (const chave of ['preferencias','visitas','favoritos_comercio','roteiros','rascunho']) {
    const bruto=localStorage.getItem('j360_'+chave)
    if (bruto!==null) {
      try { dados[chave]=JSON.parse(bruto) }
      catch { throw new Error('Dados locais danificados. Revise a cópia ou desmarque a importação para cadastrar.') }
    }
  }
  return {email,dados}
}
