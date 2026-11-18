import HomeHero from '../components/home/HomeHero'
import StatsBar from '../components/home/StatsBar'
import SectionHeader from '../components/home/SectionHeader'
import AtalhoCard from '../components/home/AtalhoCard'
import DestaquePrincipal from '../components/home/DestaquePrincipal'
import DestaqueItem from '../components/home/DestaqueItem'
import ComercioCard from '../components/home/ComercioCard'
import CtaBand from '../components/home/CtaBand'
import Footer from '../components/Footer'
import {
  atalhos,
  comerciosEmDestaque,
  destaquePrincipal,
  destaques,
  heroFoto,
  indicadores,
} from '../data/home'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <main>
        <HomeHero foto={heroFoto}>
          <StatsBar itens={indicadores} />
        </HomeHero>

        <section className="home-section home-section--branca" aria-labelledby="home-atalhos-titulo" data-nav-tema="clara">
          <div className="home-container">
            <SectionHeader id="home-atalhos-titulo" titulo="O que você encontra no site" />
            <ul className="home-atalhos">
              {atalhos.map((a) => (
                <li key={a.id}><AtalhoCard {...a} /></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-destaques-titulo" data-nav-tema="clara">
          <div className="home-container">
            <SectionHeader
              id="home-destaques-titulo"
              titulo="Atrativos turísticos"
              texto="Praias, patrimônio histórico e pontos culturais do município."
              linkTo="/mapa"
              linkTexto="Ver todos no mapa"
            />
            <div className="home-destaques">
              <DestaquePrincipal {...destaquePrincipal} />
              <ul className="home-lista">
                {destaques.map((d) => (
                  <li key={d.id}><DestaqueItem {...d} /></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="home-section home-section--espuma" aria-labelledby="home-comercio-titulo" data-nav-tema="clara">
          <div className="home-container">
            <SectionHeader
              id="home-comercio-titulo"
              titulo="Comércio local"
              texto="Quiosques, passeios guiados e outros negócios da cidade."
              linkTo="/comercio"
              linkTexto="Ver todos os comércios"
            />
            <ul className="home-comercios">
              {comerciosEmDestaque.map((c) => (
                <li key={c.id}><ComercioCard {...c} /></li>
              ))}
            </ul>
          </div>
        </section>

        <CtaBand
          titulo="Monte seu roteiro"
          texto="Escolha os lugares que quer visitar e salve o roteiro para consultar depois."
          acao={{ to: '/roteiros', rotulo: 'Montar roteiro' }}
        />
      </main>
      <Footer />
    </div>
  )
}
