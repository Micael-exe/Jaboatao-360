import HomeHero from '../components/home/HomeHero'
import StatsBar from '../components/home/StatsBar'
import SectionHeader from '../components/home/SectionHeader'
import AtalhoCard from '../components/home/AtalhoCard'
import DestaqueCard from '../components/home/DestaqueCard'
import ComercioCard from '../components/home/ComercioCard'
import CtaBand from '../components/home/CtaBand'
import Footer from '../components/Footer'
import { atalhos, comerciosEmDestaque, destaques, heroFoto, indicadores } from '../data/home'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <main>
        <HomeHero foto={heroFoto} />
        <StatsBar itens={indicadores} />

        <section className="home-section" aria-labelledby="home-atalhos-titulo">
          <div className="home-container">
            <SectionHeader
              id="home-atalhos-titulo"
              eyebrow="Tudo em um só lugar"
              titulo="Planeje sua visita"
              texto="Do mapa ao roteiro pronto: escolha por onde começar."
            />
            <ul className="home-grid home-grid--4">
              {atalhos.map((a) => (
                <li key={a.id}><AtalhoCard {...a} /></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-section home-section--sem-topo" aria-labelledby="home-destaques-titulo">
          <div className="home-container">
            <SectionHeader
              id="home-destaques-titulo"
              eyebrow="Atrativos"
              titulo="Destaques turísticos"
              texto="Praias, história e cultura para conhecer em Jaboatão dos Guararapes."
              linkTo="/mapa"
              linkTexto="Ver todos no mapa"
            />
            <ul className="home-grid home-grid--3">
              {destaques.map((d) => (
                <li key={d.id}><DestaqueCard {...d} /></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="home-section home-section--espuma" aria-labelledby="home-comercio-titulo">
          <div className="home-container">
            <SectionHeader
              id="home-comercio-titulo"
              eyebrow="Comércio local"
              titulo="Sabores e experiências da cidade"
              texto="Apoie quem faz Jaboatão acontecer: de quiosques a passeios guiados."
              linkTo="/comercio"
              linkTexto="Ver todos os comércios"
            />
            <ul className="home-grid home-grid--3">
              {comerciosEmDestaque.map((c) => (
                <li key={c.id}><ComercioCard {...c} /></li>
              ))}
            </ul>
          </div>
        </section>

        <CtaBand
          titulo="Monte seu roteiro por Jaboatão"
          texto="Combine atrativos e comércios locais em um passeio só seu e salve para consultar quando quiser."
          acao={{ to: '/roteiros', rotulo: 'Montar meu roteiro' }}
          secundaria={{ to: '/mapa', rotulo: 'Ou comece pelo mapa' }}
        />
      </main>
      <Footer />
    </div>
  )
}
