import { Link } from 'react-router-dom'

export default function CtaBand({ titulo, texto, acao, secundaria }) {
  return (
    <section className="home-cta" aria-labelledby="home-cta-titulo">
      <div className="home-container home-cta-grid">
        <div>
          <h2 id="home-cta-titulo" className="home-cta-titulo">{titulo}</h2>
          <p className="home-cta-texto">{texto}</p>
        </div>
        <div className="home-cta-acoes">
          <Link to={acao.to} className="home-btn-sol">{acao.rotulo}</Link>
          {secundaria && (
            <Link to={secundaria.to} className="home-cta-link">{secundaria.rotulo}</Link>
          )}
        </div>
      </div>
    </section>
  )
}
