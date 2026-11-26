import { catalogo, interessesDisponiveis } from '../../frontend/src/data/dados.js'
import { cnpjValido } from '../../frontend/src/data/regras.js'

export class Falha extends Error {
  constructor(status, mensagem) { super(mensagem); this.status = status }
}
export function exigir(condicao, mensagem = 'Confira os dados informados.', status = 400) {
  if (!condicao) throw new Falha(status, mensagem)
}
const tipos = ['Turista','Empreendedor','Empresa']
const origens = new Map(catalogo.map(l => [l.id,l.origem]))
const interesses = new Set(interessesDisponiveis.map(i => i.id))
const texto = (v, max, min = 0) => typeof v === 'string' && v.trim().length >= min && v.length <= max
const idValido = v => /^[\w-]{1,100}$/.test(String(v)) && (typeof v === 'string' || Number.isSafeInteger(v))
const lista = (v, max = 2000) => Array.isArray(v) && v.length <= max
const unicos = valores => new Set(valores).size === valores.length
const dia = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().startsWith(v)
const vazio = { id: null, nome: '', data: '', paradas: [] }
export const normalizarEmail = v => typeof v === 'string' ? v.trim().toLowerCase() : ''
export function validarConta(c) {
  exigir(c && texto(c.nome,160,2) && texto(c.cidade ?? '',120) && tipos.includes(c.tipoUsuario),'Confira o nome, a cidade e o perfil.')
  exigir(texto(c.email,254,3) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email),'Informe um e-mail válido.')
  exigir(['espuma','sol','vivo','claro'].includes(c.avatar ?? 'espuma'),'Escolha uma cor de avatar.')
  if (c.tipoUsuario !== 'Turista') {
    exigir(texto(c.negocio,180,1) && texto(c.ramo,100,1) && texto(c.bairro ?? '',120),'Informe o nome e o ramo do negócio.')
    if (c.tipoUsuario === 'Empresa') exigir(cnpjValido(c.cnpj),'Informe um CNPJ válido.')
  }
}
function validarRoteiro(r, salvo) {
  exigir(r && texto(r.nome,200,salvo ? 1 : 0) && (r.data === '' || dia(r.data)) && lista(r.paradas,500),'Confira o nome, a data e as paradas do roteiro.')
  exigir(salvo ? idValido(r.id) && r.paradas.length > 0 : r.id == null || idValido(r.id))
  for (const p of r.paradas) exigir(p && idValido(p.uid) && (p.nomeMapa == null ? origens.has(p.ref) : texto(p.nomeMapa,190,1) && texto(p.ref,255,1)) && (p.hora === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(p.hora)),'Parada ou horário inválido.')
  exigir(unicos(r.paradas.map(p => String(p.uid))))
}
export function validarAlteracoes(m) {
  exigir(m && typeof m === 'object' && !Array.isArray(m))
  for (const [chave,v] of Object.entries(m)) {
    switch (chave) {
      case 'conta': validarConta(v); break
      case 'preferencias':
        exigir(v && ['tranquilo','moderado','intenso'].includes(v.ritmo) && ['$','$$','$$$'].includes(v.orcamento))
        exigir(lista(v.interesses,100) && v.interesses.every(i => interesses.has(i)) && unicos(v.interesses))
        exigir(['novidades','roteiros','comercio'].every(k => typeof v.notificacoes?.[k] === 'boolean'))
        break
      case 'favoritos_comercio':
        exigir(lista(v) && v.every(id => origens.get(id) === 'Comércio') && unicos(v)); break
      case 'visitas':
        exigir(lista(v) && v.every(i => i && idValido(i.id) && origens.get(i.atrativoId) === 'Atrativo' && dia(i.data) && texto(i.nota ?? '',4000)))
        exigir(unicos(v.map(i => String(i.id)))); break
      case 'rascunho': validarRoteiro(v,false); break
      case 'roteiros':
        exigir(lista(v,500)); v.forEach(r => validarRoteiro(r,true))
        exigir(unicos(v.map(r => String(r.id)))); break
      default: throw new Falha(400,'Campo de atualização desconhecido.')
    }
  }
}

// Nomes de tabela e colunas abaixo vêm exclusivamente dos mapeamentos deste módulo.
async function gravarLinha(cx,tabela,chave,dados) {
  const colunas = [...Object.keys(chave),...Object.keys(dados)]
  const campos = Object.keys(dados)
  const atualizar = campos.length ? campos.map(k => k+'=?').join(',') : colunas[0]+'='+colunas[0]
  await cx.execute('INSERT INTO '+tabela+' ('+colunas.join(',')+') VALUES ('+colunas.map(()=>'?').join(',')+') ON DUPLICATE KEY UPDATE '+atualizar,
    [...Object.values(chave),...Object.values(dados),...Object.values(dados)])
}
async function removerAusentes(cx,tabela,filtro,args,campo,ids) {
  const manter = ids.length ? ' AND '+campo+' NOT IN ('+ids.map(()=>'?').join(',')+')' : ''
  await cx.execute('DELETE FROM '+tabela+' WHERE '+filtro+manter,[...args,...ids])
}
async function gravarRoteiro(cx,conta,r,id,posicao,edita) {
  await gravarLinha(cx,'roteiros',{conta_id:conta,id},{nome:r.nome,dia:r.data || null,posicao,edita_id:edita})
  for (const [ordem,p] of r.paradas.entries()) {
    await gravarLinha(cx,'paradas',{conta_id:conta,roteiro_id:id,uid:String(p.uid)},{local_id:p.nomeMapa ? null : p.ref,referencia_externa:p.nomeMapa ? p.ref : null,nome_externo:p.nomeMapa ?? null,horario:p.hora || null,posicao:ordem})
  }
  await removerAusentes(cx,'paradas','conta_id=? AND roteiro_id=?',[conta,id],'uid',r.paradas.map(p=>String(p.uid)))
}
export async function persistir(cx,id,m) {
  if (m.conta) {
    const c=m.conta
    await cx.execute('UPDATE contas SET nome=?, email=?, cidade=?, tipo=?, avatar=COALESCE(?,avatar) WHERE id=?',
      [c.nome.trim(),normalizarEmail(c.email),c.cidade ?? '',c.tipoUsuario,c.avatar ?? null,id])
    if (c.tipoUsuario === 'Turista') await cx.execute('DELETE FROM negocios WHERE conta_id=?',[id])
    else await gravarLinha(cx,'negocios',{conta_id:id},{nome:c.negocio,ramo:c.ramo,bairro:c.bairro ?? '',cnpj:c.tipoUsuario==='Empresa' ? c.cnpj.replace(/\D/g,'') : null})
  }
  if (m.preferencias) {
    const {ritmo,orcamento,notificacoes:n,interesses:itens}=m.preferencias
    await gravarLinha(cx,'preferencias',{conta_id:id},{ritmo,orcamento,novidades:n.novidades,lembretes_roteiros:n.roteiros,ofertas_comercio:n.comercio})
    for (const interesse of itens) await gravarLinha(cx,'interesses_conta',{conta_id:id,interesse},{})
    await removerAusentes(cx,'interesses_conta','conta_id=?',[id],'interesse',itens)
  }
  if (m.favoritos_comercio) {
    for (const local_id of m.favoritos_comercio) await gravarLinha(cx,'favoritos',{conta_id:id,local_id},{})
    await removerAusentes(cx,'favoritos','conta_id=?',[id],'local_id',m.favoritos_comercio)
  }
  if (m.visitas) {
    for (const v of m.visitas) await gravarLinha(cx,'visitas',{conta_id:id,id:String(v.id)},{local_id:v.atrativoId,dia:v.data,nota:v.nota ?? ''})
    await removerAusentes(cx,'visitas','conta_id=?',[id],'id',m.visitas.map(v=>String(v.id)))
  }
  if (m.roteiros) {
    for (const [i,r] of m.roteiros.entries()) await gravarRoteiro(cx,id,r,String(r.id),i,null)
    await removerAusentes(cx,'roteiros',"conta_id=? AND id<>'@rascunho'",[id],'id',m.roteiros.map(r=>String(r.id)))
  }
  if (m.rascunho) await gravarRoteiro(cx,id,m.rascunho,'@rascunho',0,m.rascunho.id ?? null)
}

export async function carregar(cx,id) {
  const linhas = async sql => (await cx.execute(sql,[id]))[0]
  const [c] = await linhas(`SELECT c.id,c.revisao,c.nome,c.email,c.cidade,c.tipo AS tipoUsuario,c.avatar,
    n.nome AS negocio,n.ramo,n.bairro,n.cnpj FROM contas c LEFT JOIN negocios n ON n.conta_id=c.id WHERE c.id=?`)
  exigir(c,'Sessão encerrada.',401)
  const {id:contaId,revisao,...conta} = c
  const [p] = await linhas('SELECT * FROM preferencias WHERE conta_id=?')
  const itens = await linhas('SELECT interesse FROM interesses_conta WHERE conta_id=? ORDER BY interesse')
  const favoritos = await linhas('SELECT local_id FROM favoritos WHERE conta_id=? ORDER BY local_id')
  const visitas = await linhas('SELECT id, local_id AS atrativoId, dia AS data, nota FROM visitas WHERE conta_id=? ORDER BY dia DESC,id')
  const rotas = await linhas('SELECT id,nome,dia,edita_id FROM roteiros WHERE conta_id=? ORDER BY posicao,id')
  const paradas = await linhas('SELECT roteiro_id,uid,COALESCE(local_id,referencia_externa) AS ref,nome_externo,horario FROM paradas WHERE conta_id=? ORDER BY roteiro_id,posicao')
  const porRota = new Map(rotas.map(r=>[r.id,{id:r.id,nome:r.nome,data:r.dia ?? '',paradas:[]}]))
  for (const p of paradas) porRota.get(p.roteiro_id).paradas.push({uid:p.uid,ref:p.ref,...(p.nome_externo && {nomeMapa:p.nome_externo}),hora:p.horario?.slice(0,5) ?? ''})
  const rascunho = porRota.get('@rascunho') ?? {...vazio}
  if (porRota.delete('@rascunho')) rascunho.id = rotas.find(r=>r.id==='@rascunho').edita_id
  return {contaId,revisao,dados:{
    conta,preferencias:{interesses:itens.map(i=>i.interesse),ritmo:p.ritmo,orcamento:p.orcamento,
      notificacoes:{novidades:Boolean(p.novidades),roteiros:Boolean(p.lembretes_roteiros),comercio:Boolean(p.ofertas_comercio)}},
    favoritos_comercio:favoritos.map(f=>f.local_id),visitas,roteiros:[...porRota.values()],rascunho,
  }}
}
