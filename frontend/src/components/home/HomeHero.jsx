import { Link } from 'react-router-dom'
import Foto from './Foto'

export default function HomeHero({ foto, children }) {
  return (
    <section className="home-hero" aria-labelledby="home-hero-titulo" data-nav-tema="escura">
      {/* Imagem decorativa: o texto da página já diz tudo, por isso alt vazio */}
      <Foto nome={foto.nome} alt="" prioridade className="home-hero-foto" />
      <div className="home-hero-veu" aria-hidden="true" />
      <div className="home-container home-hero-conteudo">
        <h1 id="home-hero-titulo" className="home-hero-titulo">Conheça Jaboatão dos Guararapes</h1>
        <p className="home-hero-texto">
          Veja os atrativos no mapa, encontre comércios e experiências locais e monte um roteiro
          para a sua visita.
        </p>
        <div className="home-hero-acoes">
          <Link to="/mapa" className="home-btn home-btn--sol">Ver o mapa</Link>
          <Link to="/roteiros" className="home-btn home-btn--contorno">Montar roteiro</Link>
        </div>
        {children}
      </div>
    </section>
  )
}
