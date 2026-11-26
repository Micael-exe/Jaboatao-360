import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { abrirPool } from './conexao.mjs'
import { migrar } from './migrar.mjs'
import { criarApi } from './api.mjs'

test('contas e migrações em um esquema MySQL isolado', async t => {
  assert.ok(process.env.DB_USER?.trim(),
    'Configure DB_USER em backend/.env.teste.local ou no ambiente. Use .env.teste.example como modelo e consulte a seção 20.7 de docs/DOCUMENTACAO.md.')
  const nome='j360_teste_'+randomUUID().replaceAll('-','')
  const admin=abrirPool({...process.env,DB_NAME:'information_schema'})
  const pool=abrirPool({...process.env,DB_NAME:nome})
  await admin.query('CREATE DATABASE '+nome+' CHARACTER SET utf8mb4 COLLATE utf8mb4_bin')
  t.after(async()=>{ await pool.end(); try { await admin.query('DROP DATABASE '+nome) } finally { await admin.end() } })
  const api=criarApi(pool, async email=>email==='recusado@example.com' ? 'invalido' : 'valido')
  async function chamar(method,url,corpo,cookie='') {
    const req=Readable.from(corpo ? [Buffer.from(JSON.stringify(corpo))] : [])
    Object.assign(req,{method,url,headers:{cookie,'content-type':'application/json'},socket:{remoteAddress:'local'}})
    const res={ status:0,headers:{},setHeader(k,v){this.headers[k]=v},writeHead(s){this.status=s},end(b){this.dados=JSON.parse(b)} }
    await api(req,res)
    return res
  }
  const cadastro={email:'ANA@example.com',senha:'Segredo1!',categoria:'turista',conta:{nome:'Ana',cidade:'Recife'}}
  let cookie, contaId
  const roteiro={id:'r1',nome:'Praias',data:'2026-11-25',paradas:[{uid:'p1',ref:'a-1',hora:'09:30'},{uid:'p2',ref:'museu-externo',nomeMapa:'Museu do passeio',hora:''}]}
  await t.test('campo novo recebe o padrão em uma conta anterior e a migração pode rodar novamente',async()=>{
    await migrar(pool,1)
    await pool.execute("INSERT INTO contas (id,email,senha_hash,nome,tipo) VALUES (?,?,?,?,?)",[randomUUID(),'antiga@example.com','amostra','Antiga','Turista'])
    await migrar(pool)
    await migrar(pool)
    const [[antiga]]=await pool.query("SELECT nome,avatar FROM contas WHERE email='antiga@example.com'")
    assert.deepEqual({...antiga},{nome:'Antiga',avatar:'espuma'})
  })
  await t.test('cadastro importa dados antigos atomicamente e não guarda senha ou token em claro',async()=>{
    const r=await chamar('POST','/api/cadastro',{...cadastro,legado:{email:cadastro.email,dados:{roteiros:[roteiro],rascunho:roteiro,favoritos_comercio:['c-1']}}})
    assert.equal(r.status,201,JSON.stringify(r.dados))
    assert.match(r.headers['Set-Cookie'],/HttpOnly/)
    cookie=r.headers['Set-Cookie'].split(';')[0]; contaId=r.dados.contaId
    assert.deepEqual(r.dados.dados.roteiros,[roteiro])
    assert.deepEqual(r.dados.dados.rascunho,roteiro)
    assert.equal(r.dados.dados.conta.avatar,'espuma')
    const [[u]]=await pool.execute('SELECT senha_hash FROM contas WHERE id=?',[contaId])
    assert.ok(!u.senha_hash.includes(cadastro.senha))
    const [[s]]=await pool.execute('SELECT token_hash FROM sessoes WHERE conta_id=?',[contaId])
    assert.notEqual(s.token_hash,cookie.split('=')[1])
  })
  await t.test('login rejeita senha incorreta e cadastro rejeita duplicata ou e-mail inválido',async()=>{
    assert.equal((await chamar('POST','/api/login',{...cadastro,senha:'Errada1!'})).status,401)
    assert.equal((await chamar('POST','/api/cadastro',cadastro)).status,409)
    assert.equal((await chamar('POST','/api/cadastro',{...cadastro,email:'recusado@example.com'})).status,422)
  })
  await t.test('preferências, visita, negócio e parada reordenada persistem após nova sessão',async()=>{
    const {dados}= (await chamar('GET','/api/sessao',null,cookie)).dados
    const conta={...dados.conta,avatar:'sol',tipoUsuario:'Empresa',negocio:'Hotel',ramo:'Hospedagem',cnpj:'11222333000181'}
    const mudancas={conta,preferencias:{...dados.preferencias,ritmo:'intenso',interesses:['cultura'],notificacoes:{roteiros:false,comercio:true,novidades:false}},
      visitas:[{id:'v1',atrativoId:'a-2',data:'2026-11-25',nota:'Primeira visita'}],roteiros:[{...roteiro,paradas:[...roteiro.paradas].reverse()}]}
    const r=await chamar('PATCH','/api/dados',{contaId,revisao:0,alteracoes:mudancas},cookie)
    assert.equal(r.status,200,JSON.stringify(r.dados))
    const login=await chamar('POST','/api/login',{...cadastro,categoria:'empresa'})
    assert.equal(login.status,200,JSON.stringify(login.dados))
    for (const k of ['visitas','preferencias','roteiros']) assert.deepEqual(login.dados.dados[k],mudancas[k])
    assert.equal(login.dados.dados.conta.negocio,'Hotel')
  })
  await t.test('uma revisão antiga e referências inválidas não sobrescrevem dados',async()=>{
    const antigas={contaId,revisao:0,alteracoes:{favoritos_comercio:[]}}
    assert.equal((await chamar('PATCH','/api/dados',antigas,cookie)).status,409)
    assert.equal((await chamar('PATCH','/api/dados',{...antigas,revisao:1,alteracoes:{visitas:[],favoritos_comercio:['desconhecido']}},cookie)).status,400)
    const {dados,revisao}=(await chamar('GET','/api/sessao',null,cookie)).dados
    assert.equal(revisao,1);assert.deepEqual(dados.favoritos_comercio,['c-1']);assert.equal(dados.visitas.length,1)
  })
  await t.test('a segunda conta fica isolada; exclusões em cascata e logout são efetivos',async()=>{
    const b=await chamar('POST','/api/cadastro',{...cadastro,email:'bia@example.com'})
    assert.deepEqual(b.dados.dados.roteiros,[])
    const patch={contaId,revisao:1,alteracoes:{roteiros:[]}}
    assert.equal((await chamar('PATCH','/api/dados',patch,b.headers['Set-Cookie'].split(';')[0])).status,409)
    assert.equal((await chamar('PATCH','/api/dados',patch,cookie)).status,200)
    const [p]=await pool.execute('SELECT uid FROM paradas WHERE conta_id=? AND roteiro_id=?',[contaId,'r1'])
    assert.equal(p.length,0)
    const anterior = (await chamar('GET', '/api/sessao', null, cookie)).dados
    const { avatar, ...perfilAntigo } = anterior.dados.conta
    assert.equal(avatar, 'sol')
    const salvarPerfil = (perfil) => chamar('PATCH', '/api/dados', {
      contaId, revisao: anterior.revisao, alteracoes: { conta: perfil },
    }, cookie)
    assert.equal((await salvarPerfil({ ...perfilAntigo, email: 'bia@example.com' })).status, 409)
    assert.equal((await salvarPerfil({ ...perfilAntigo, cidade: 'Olinda' })).status, 200)
    const atualizado = (await chamar('GET', '/api/sessao', null, cookie)).dados
    assert.equal(atualizado.revisao, anterior.revisao + 1)
    assert.equal(atualizado.dados.conta.avatar, 'sol')
    assert.equal(atualizado.dados.conta.cidade, 'Olinda')
    await chamar('POST','/api/sair',{},cookie)
    assert.equal((await chamar('GET','/api/sessao',null,cookie)).dados,null)
    assert.equal((await chamar('PATCH','/api/dados',patch,cookie)).status,401)
  })
})
