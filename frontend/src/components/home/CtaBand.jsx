import { Link } from 'react-router-dom'

export default function CtaBand({ titulo, texto, acao }) {
  return (
    <section className="home-cta" aria-labelledby="home-cta-titulo">
      <div className="home-container home-cta-grid">
        <div>
          <h2 id="home-cta-titulo" className="home-cta-titulo">{titulo}</h2>
          <p className="home-cta-texto">{texto}</p>
        </div>
        <Link to={acao.to} className="home-btn home-btn--sol">{acao.rotulo}</Link>
      </div>
    </section>
  )
}
