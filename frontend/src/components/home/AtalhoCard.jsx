import { Link } from 'react-router-dom'

const traco = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const icones = {
  mapa: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z" {...traco} />
      <circle cx="12" cy="10" r="2.4" {...traco} />
    </>
  ),
  roteiros: (
    <>
      <circle cx="6" cy="18" r="2" {...traco} />
      <circle cx="18" cy="6" r="2" {...traco} />
      <path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" {...traco} />
    </>
  ),
  comercio: (
    <>
      <path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M10 20v-6h4v6" {...traco} />
    </>
  ),
  perfil: (
    <>
      <circle cx="12" cy="8" r="4" {...traco} />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" {...traco} />
    </>
  ),
}

export default function AtalhoCard({ id, to, titulo, texto, acao }) {
  return (
    <article className="home-card home-atalho">
      <div className="home-icone">
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">{icones[id]}</svg>
      </div>
      <h3 className="home-card-titulo">
        <Link to={to} className="home-card-link">{titulo}</Link>
      </h3>
      <p className="home-card-texto">{texto}</p>
      <span className="home-card-acao" aria-hidden="true">{acao} →</span>
    </article>
  )
}
