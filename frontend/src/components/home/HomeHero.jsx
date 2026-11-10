import { Link } from 'react-router-dom'
import Foto from './Foto'

const seta = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9h12M10 4l5 5-5 5" />
  </svg>
)

export default function HomeHero({ foto }) {
  return (
    <section className="home-hero" aria-labelledby="home-hero-titulo">
      <div className="home-container home-hero-grid">
        <div className="home-hero-texto-col">
          <p className="home-eyebrow">Jaboatão dos Guararapes · PE</p>
          <h1 id="home-hero-titulo" className="home-hero-title">
            <span>Descubra.</span>
            <span>Explore.</span>
            <span>Viva Jaboatão.</span>
          </h1>
          <p className="home-hero-texto">
            O <strong>Jaboatão 360</strong> é seu guia para conhecer os atrativos turísticos,
            culturais e naturais de Jaboatão dos Guararapes – PE.
          </p>
          <div className="home-hero-acoes">
            <Link to="/mapa" className="btn btn-lg">
              Explorar o mapa
              {seta}
            </Link>
            <Link to="/roteiros" className="home-btn-sec">Montar um roteiro</Link>
          </div>
        </div>

        <div className="home-hero-media">
          <span className="home-hero-sol" aria-hidden="true" />
          <Foto nome={foto.nome} alt={foto.alt} prioridade className="home-hero-foto" />
        </div>
      </div>

      <svg className="home-hero-onda" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 28q180-40 360 0t360 0 360 0 360 0V56H0z" />
      </svg>
    </section>
  )
}
