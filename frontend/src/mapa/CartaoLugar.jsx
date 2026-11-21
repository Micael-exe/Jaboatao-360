import { useRef, useState } from 'react'

export default function CartaoLugar({ local, decidir, ilustrativa, escolhido }) {
  const gesto = useRef(null)
  const [arrasto, mover] = useState(0)
  const [semFoto, falhou] = useState(false)
  function encerrar(event) {
    const inicio = gesto.current
    gesto.current = null
    mover(0)
    if (!inicio || inicio.id !== event.pointerId) return
    const dx = event.clientX - inicio.x, dy = event.clientY - inicio.y
    if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.25) decidir(dx > 0)
  }
  return <div className="map-deck">
    <article className="map-cartao" style={{ transform: `translateX(${arrasto}px) rotate(${arrasto / 24}deg)` }}
      onPointerDown={e => {
        if (!e.isPrimary || e.button !== 0) return
        gesto.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={e => {
        if (gesto.current?.id === e.pointerId) mover(Math.max(-70, Math.min(70, e.clientX - gesto.current.x)))
      }}
      onPointerUp={encerrar} onPointerCancel={() => { gesto.current = null; mover(0) }}>
      {local.foto && !semFoto
        ? <img src={local.foto} alt={ilustrativa ? 'Foto ilustrativa da categoria' : local.nome}
          draggable="false" onError={() => falhou(true)} />
        : <div className="map-semfoto">Foto indisponível</div>}
      <div className="map-legenda">
        <span>{local.tags.join(' · ')}{ilustrativa && local.foto && !semFoto && ' · Foto ilustrativa'}</span>
        <h2>{local.nome}</h2>
        {escolhido && <p>Já escolhido para este passeio</p>}
      </div>
    </article>
    <p className="map-ajuda">Deslize a foto para a esquerda para pular ou para a direita para visitar.</p>
    <div className="map-acoes duplas">
      <button className="map-sec" onClick={() => decidir(false)}>← Pular</button>
      <button className="map-pri" onClick={() => decidir(true)}>Quero visitar →</button>
    </div>
  </div>
}
