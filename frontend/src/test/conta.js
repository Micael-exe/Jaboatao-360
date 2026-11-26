import { vi } from 'vitest'
import { receberConta } from '../data/banco'

export function exemplo(conta={}) {
  return {contaId:'id-teste',revisao:0,dados:{
    conta:{nome:'Visitante Jaboatão',email:'ana@exemplo.com',cidade:'Recife',tipoUsuario:'Turista',avatar:'espuma',...conta},
    preferencias:{ritmo:'moderado',orcamento:'$$',interesses:['praias','historia'],notificacoes:{novidades:true,roteiros:true,comercio:false}},
    visitas:[],roteiros:[],favoritos_comercio:[],rascunho:{id:null,nome:'',data:'',paradas:[]},
  }}
}
export function simularConta(conta) {
  receberConta(exemplo(conta))
  vi.stubGlobal('fetch',vi.fn(async (url,op)=>{
    if (url==='/api/dados') return {ok:true,json:async()=>({revisao:JSON.parse(op.body).revisao+1})}
    if (url==='/api/sair') return {ok:true,json:async()=>({})}
    throw new Error('Chamada inesperada '+url)
  }))
}
