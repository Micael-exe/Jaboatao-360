import { createHash, randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { senhaValida } from '../../frontend/src/data/regras.js'
import { transacao } from './conexao.mjs'
import { carregar, exigir, Falha, normalizarEmail, persistir, validarAlteracoes, validarConta } from './dados.mjs'

const derivar = promisify(scrypt)
const opcoes = { N: 32768, r: 8, p: 3, maxmem: 64*1024*1024 }
const dias = 7*86400
const resumir = s => createHash('sha256').update(s).digest('hex')
const categorias = { turista:'Turista', empreendedor:'Empreendedor', empresa:'Empresa' }
async function gerarHash(senha) {
  const sal = randomBytes(16).toString('hex')
  const hash = await derivar(senha,sal,64,opcoes)
  return 's1:'+sal+':'+hash.toString('hex')
}
async function confere(senha,valor) {
  const [,sal,hex] = (valor || 's1:sem-conta:'+('00'.repeat(64))).split(':')
  const hash = await derivar(senha,sal,64,opcoes)
  return timingSafeEqual(hash,Buffer.from(hex,'hex'))
}
async function validarEmail(email,verificar) {
  let estado
  try { estado = await verificar(email) } catch { estado='indisponivel' }
  if (estado === 'valido') return
  if (estado === 'invalido') throw new Falha(422,'Este endereço de e-mail é inválido.')
  if (estado === 'inconclusivo') throw new Falha(422,'Não foi possível confirmar esta caixa de e-mail.')
  throw new Falha(503,'A verificação de e-mail está indisponível. Tente novamente.')
}
async function lerCorpo(req) {
  exigir(req.headers['content-type']?.split(';')[0] === 'application/json','Envie JSON.',415)
  const partes=[]
  let tamanho=0
  for await (const p of req) {
    tamanho+=p.length
    exigir(tamanho<=1024*1024,'O conjunto de alterações ultrapassou 1 MiB.',413)
    partes.push(p)
  }
  try {
    const v=JSON.parse(Buffer.concat(partes).toString())
    if (v && typeof v === 'object' && !Array.isArray(v)) return v
  } catch { /* Corpo inválido. */ }
  throw new Falha(400,'Corpo JSON inválido.')
}
export function criarApi(pool,verificar,{seguro=false}={}) {
  const frequencia=new Map()
  let inicio=Date.now()
  const cookie=(s,idade)=>'j360_sid='+s+'; Path=/; HttpOnly; SameSite=Lax; Max-Age='+idade+(seguro?'; Secure':'')
  return async (req,res) => {
    const enviar=(status,obj)=> {
      res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'})
      res.end(JSON.stringify(obj))
    }
    try {
      const rota=req.method+' '+req.url
      const token=req.headers.cookie?.match(/(?:^|;\s*)j360_sid=([a-f0-9]{64})(?:;|$)/)?.[1]
      const mutacao=req.method!=='GET'
      if (mutacao && req.headers.origin) {
        exigir(new URL(req.headers.origin).host===req.headers.host,'Origem inválida.',403)
      }
      const v=mutacao ? await lerCorpo(req) : {}
      if (rota==='POST /api/login' || rota==='POST /api/cadastro') {
        if (Date.now()-inicio>=60000) { inicio=Date.now(); frequencia.clear() }
        const ip=req.socket.remoteAddress || 'local'
        const tentativas=frequencia.get(ip) || 0
        exigir(tentativas<20,'Muitas tentativas. Aguarde um minuto.',429)
        frequencia.set(ip,tentativas+1)
        const email=normalizarEmail(v.email)
        exigir(typeof v.senha==='string' && v.senha.length<=256 && v.senha.length>0,'Informe uma senha válida.')
        const novoToken=randomBytes(32).toString('hex')
        let id
        let conta
        let hash
        let legado={}
        if (rota==='POST /api/cadastro') {
          exigir(senhaValida(v.senha),'A senha deve seguir as regras de cadastro.')
          id=randomUUID()
          conta={...v.conta,email,tipoUsuario:categorias[v.categoria]}
          validarConta(conta)
          if (v.legado) {
            exigir(normalizarEmail(v.legado.email)===email,'Os dados locais pertencem a outro endereço.')
            legado=v.legado.dados
            exigir(legado && !Object.hasOwn(legado,'conta'),'Importação local inválida.')
            validarAlteracoes(legado)
          }
          await validarEmail(email,verificar)
          hash=await gerarHash(v.senha)
        } else {
          const [[usuario]]=await pool.execute('SELECT id,senha_hash,tipo FROM contas WHERE email=?',[email])
          const ok=await confere(v.senha,usuario?.senha_hash)
          exigir(ok && usuario?.tipo===categorias[v.categoria],'Confira o e-mail, a senha e a categoria.',401)
          id=usuario.id
        }
        const estado=await transacao(pool,async cx=>{
          if (conta) {
            await cx.execute('INSERT INTO contas(id,email,senha_hash,nome,tipo) VALUES (?,?,?,?,?)',[id,email,hash,conta.nome,conta.tipoUsuario])
            await cx.execute('INSERT INTO preferencias(conta_id) VALUES (?)',[id])
            await cx.execute('INSERT INTO interesses_conta(conta_id,interesse) VALUES (?,?),(?,?)',[id,'praias',id,'historia'])
            await persistir(cx,id,{...legado,conta})
          }
          if (token) await cx.execute('DELETE FROM sessoes WHERE token_hash=?',[resumir(token)])
          await cx.execute('DELETE FROM sessoes WHERE expira_em<=?',[Date.now()])
          await cx.execute('INSERT INTO sessoes(token_hash,conta_id,expira_em) VALUES (?,?,?)',[resumir(novoToken),id,Date.now()+dias*1000])
          return carregar(cx,id)
        })
        res.setHeader('Set-Cookie',cookie(novoToken,dias))
        return enviar(conta ? 201 : 200,estado)
      }
      if (rota==='POST /api/sair') {
        if (token) await pool.execute('DELETE FROM sessoes WHERE token_hash=?',[resumir(token)])
        res.setHeader('Set-Cookie',cookie('',0))
        return enviar(200,{})
      }
      exigir(['GET /api/sessao','PATCH /api/dados'].includes(rota),'Recurso inexistente.',404)
      const [[sessao]]=token ? await pool.execute('SELECT conta_id FROM sessoes WHERE token_hash=? AND expira_em>?',[resumir(token),Date.now()]) : [[]]
      if (rota==='GET /api/sessao') return enviar(200,sessao ? await transacao(pool,cx=>carregar(cx,sessao.conta_id)) : null)
      exigir(sessao,'Entre novamente na sua conta.',401)
      const id=sessao.conta_id
      exigir(v.contaId===id,'A conta ativa mudou. Reabra a página.',409)
      exigir(Number.isSafeInteger(v.revisao) && v.revisao>=0)
      validarAlteracoes(v.alteracoes)
      if (v.alteracoes.conta) {
        const [[atual]]=await pool.execute('SELECT email FROM contas WHERE id=?',[id])
        const email=normalizarEmail(v.alteracoes.conta.email)
        if (email!==atual.email) await validarEmail(email,verificar)
      }
      await transacao(pool,async cx=>{
        const [r]=await cx.execute('UPDATE contas SET revisao=revisao+1 WHERE id=? AND revisao=?',[id,v.revisao])
        exigir(r.affectedRows===1,'Outra aba ou dispositivo alterou a conta. Os dados foram recarregados. Refaça a alteração.',409)
        await persistir(cx,id,v.alteracoes)
      })
      return enviar(200,{revisao:v.revisao+1})
    } catch (erro) {
      if (erro.code==='ER_DUP_ENTRY') return enviar(409,{mensagem:'E-mail ou registro já cadastrado.'})
      return enviar(erro instanceof Falha ? erro.status : 503,{mensagem:erro instanceof Falha ? erro.message : 'Não foi possível acessar o banco. Tente novamente.'})
    }
  }
}
