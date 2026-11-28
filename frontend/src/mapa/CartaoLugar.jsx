import { useEffect, useRef, useState } from 'react'

export default function CartaoLugar({ local, decidir, ilustrativa, escolhido }) {
  const gesto = useRef(null)
  const bloqueado = useRef(false)
  const timer = useRef(null)
  const [arrasto, mover] = useState(0)
  const [arrastando, definirArrastando] = useState(false)
  const [saida, definirSaida] = useState(null)
  const [semFoto, falhou] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  function escolher(incluir) {
    if (bloqueado.current) return
    bloqueado.current = true
    gesto.current = null
    definirArrastando(false)
    definirSaida(incluir ? 'visitar' : 'pular')
    const reduzir = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduzir) decidir(incluir)
    else timer.current = setTimeout(() => decidir(incluir), 320)
  }
  function cancelar() {
    gesto.current = null
    definirArrastando(false)
    mover(0)
  }
  function encerrar(event) {
    const inicio = gesto.current
    if (!inicio || inicio.id !== event.pointerId) return
    gesto.current = null
    definirArrastando(false)
    const dx = event.clientX - inicio.x, dy = event.clientY - inicio.y
    const limite = Math.min(96, event.currentTarget.clientWidth * .23)
    if (Math.abs(dx) >= limite && Math.abs(dx) > Math.abs(dy) * 1.25) escolher(dx > 0)
    else mover(0)
  }
  const intensidade = saida ? 1 : Math.min(1, Math.abs(arrasto) / 90)
  const positivo = saida ? saida === 'visitar' : arrasto > 0
  const negativo = saida ? saida === 'pular' : arrasto < 0
  return <div className="map-deck map-swipe">
    <div className="map-swipe-stage">
      <div className="map-swipe-stack" aria-hidden="true" />
      <div className="map-swipe-entry">
        <article className={`map-cartao map-swipe-card${arrastando ? ' is-dragging' : ''}${saida ? ` is-${saida}` : ''}`}
          style={{ '--swipe-x': `${arrasto}px`, '--swipe-angle': `${arrasto / 17}deg` }}
          tabIndex={0} aria-label={`${local.nome}. Setas esquerda e direita para pular ou visitar.`}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault(); escolher(e.key === 'ArrowRight')
            }
          }}
          onPointerDown={e => {
            if (bloqueado.current || !e.isPrimary || e.button !== 0) return
            gesto.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
            definirArrastando(true)
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={e => {
            if (gesto.current?.id === e.pointerId) {
              const dx = e.clientX - gesto.current.x
              mover(Math.max(-300, Math.min(300, dx)))
            }
          }}
          onPointerUp={encerrar} onPointerCancel={cancelar} onLostPointerCapture={() => { if (gesto.current) cancelar() }}>
          {local.foto && !semFoto
            ? <img src={local.foto} alt={ilustrativa ? 'Foto ilustrativa da categoria' : local.nome}
                draggable="false" onError={() => falhou(true)} />
            : <div className="map-semfoto">Foto indisponível</div>}
          <div className="map-swipe-shade" aria-hidden="true" />
          <span className="map-swipe-stamp map-swipe-yes" aria-hidden="true" style={{opacity: positivo ? intensidade : 0}}>✓ QUERO VISITAR</span>
          <span className="map-swipe-stamp map-swipe-no" aria-hidden="true" style={{opacity: negativo ? intensidade : 0}}>× PULAR</span>
          <div className="map-legenda">
            <span>{local.tags.join(' · ')}{ilustrativa && local.foto && !semFoto && ' · Foto ilustrativa'}</span>
            <h2>{local.nome}</h2>
            {escolhido && <p>Já escolhido para este passeio</p>}
          </div>
        </article>
      </div>
    </div>
    <div className="map-acoes duplas map-swipe-actions">
      <button className="map-sec map-swipe-choice skip" disabled={Boolean(saida)} onClick={() => escolher(false)}>
        <span className="map-swipe-symbol" aria-hidden="true">×</span><span>Pular</span>
      </button>
      <button className="map-pri map-swipe-choice visit" disabled={Boolean(saida)} onClick={() => escolher(true)}>
        <span className="map-swipe-symbol" aria-hidden="true">✓</span><span>Quero visitar</span>
      </button>
    </div>
    <p className="map-ajuda map-swipe-help">Deslize para a esquerda para pular ou para a direita para visitar.</p>
  </div>
}
