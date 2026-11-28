import { useState } from 'react'
import './EscolherRoteiro.css'
const prontos = [
  {id:'orla', nome:'Um dia na orla', icone:'🏖️', descricao:'Praias de Piedade, Candeias e Barra de Jangada.', ids:['a-1','a-2','a-5']},
  {id:'historia', nome:'História e cultura', icone:'🏛️', descricao:'Igreja do Pilar, Parque dos Guararapes e Morro da Conceição.', ids:['a-3','a-4','a-6']},
  {id:'sabores', nome:'Sabores e artesanato', icone:'🍴', descricao:'Praia de Piedade, Quiosque Sabor do Mar e Ateliê Mãos da Terra.', ids:['a-1','c-1','c-3']},
]
export default function EscolherRoteiro({onCriar,onSelecionar,salvos,ocupado,erro}) {
  const [abrir,setAbrir]=useState(false)
  return <section className="route-choice" aria-label="Escolher como montar o roteiro">
    <div className="route-choice-heading"><span>PLANEJE SEU PASSEIO</span><h2>Como você quer montar seu roteiro?</h2><p>Crie seu próprio passeio ou comece com uma seleção de lugares.</p></div>
    <div className="route-choice-grid">
      <button type="button" className="route-choice-card route-create" onClick={onCriar} disabled={Boolean(ocupado)}>
        <span className="route-choice-icon" aria-hidden="true">＋</span><span className="route-choice-label">PERSONALIZADO</span><strong>Criar roteiro</strong><span>Escolha seus interesses, deslize os cartões e monte o passeio do seu jeito.</span><span className="route-choice-cta">Começar agora <span aria-hidden="true">→</span></span>
      </button>
      <button type="button" className="route-choice-card route-select" aria-expanded={abrir} onClick={()=>setAbrir(v=>!v)} disabled={Boolean(ocupado)}>
        <span className="route-choice-icon" aria-hidden="true">⌖</span><span className="route-choice-label">PRONTOS E SALVOS</span><strong>Selecionar roteiro</strong><span>Escolha um passeio temático ou reutilize os lugares de um roteiro salvo.</span><span className="route-choice-cta">{abrir?'Fechar seleção':'Ver roteiros'} <span aria-hidden="true">↓</span></span>
      </button>
    </div>
    {abrir&&<div className="route-presets"><h3>Roteiros sugeridos</h3><p>Os horários e as coordenadas seguem o catálogo demonstrativo. O trajeto será recalculado considerando a abertura dos locais.</p><div className="route-preset-grid">{prontos.map(r=><button key={r.id} type="button" disabled={Boolean(ocupado)} onClick={()=>onSelecionar(r.ids,r.nome)}><span aria-hidden="true">{r.icone}</span><strong>{r.nome}</strong><small>{r.descricao}</small><b>Selecionar →</b></button>)}</div><h3>Meus roteiros salvos</h3>{salvos.length?<div className="route-preset-grid">{salvos.map(r=><button key={r.id} type="button" disabled={Boolean(ocupado)||!r.paradas?.length} onClick={()=>onSelecionar(r.paradas.map(p=>String(p.ref)),r.nome)}><span aria-hidden="true">📍</span><strong>{r.nome}</strong><small>{r.paradas?.length||0} paradas cadastradas</small><b>Reutilizar locais →</b></button>)}</div>:<p>Você ainda não tem roteiros salvos.</p>}</div>}
    {ocupado&&<p role="status">Carregando os locais do roteiro…</p>}{erro&&<p role="alert" className="map-erro">{erro}</p>}
  </section>
}
