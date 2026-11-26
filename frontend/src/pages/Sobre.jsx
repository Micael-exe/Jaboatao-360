import { useEffect, useState } from 'react'
import Foto from '../components/home/Foto'
import CtaBand from '../components/home/CtaBand'
import Footer from '../components/Footer'
import './Home.css' // tokens de cor, container e chamada final compartilhados com a home
import './Sobre.css'

const capitulos = [
  { id: 'problematica', rotulo: 'A problemática' },
  { id: 'motivacao', rotulo: 'Motivação' },
  { id: 'objetivos', rotulo: 'Objetivos' },
  { id: 'proposta', rotulo: 'Nossa proposta' },
  { id: 'contexto', rotulo: 'Projeto acadêmico' },
]

const paraVisitantes = [
  'Mapa interativo com os atrativos do município',
  'Informações detalhadas de cada atrativo',
  'Comércios e experiências locais perto de cada atrativo',
  'Roteiros para montar e salvar',
]

const paraEmpreendedores = [
  'Visibilidade para negócios e experiências da cidade',
  'Aproximação com turistas e moradores',
  'Apoio ao turismo sustentável e ao comércio local',
]

const objetivos = [
  'Valorizar o patrimônio histórico, cultural e natural de Jaboatão.',
  'Facilitar o acesso às informações turísticas do município.',
  'Incentivar a visitação dos atrativos locais.',
  'Conectar turistas, moradores e empreendedores.',
  'Promover o turismo sustentável e o comércio local.',
]

const tecnologias = [
  { grupo: 'Interface', itens: 'React e Vite' },
  { grupo: 'Servidor', itens: 'Node.js' },
  { grupo: 'Banco de dados', itens: 'MySQL 8' },
  { grupo: 'Mapas', itens: 'Leaflet e OpenStreetMap' },
  { grupo: 'Hospedagem', itens: 'Vercel e Render' },
]

function Publico({ id, titulo, texto, itens }) {
  return (
    <section className="sobre-publico" aria-labelledby={id}>
      <h3 id={id}>{titulo}</h3>
      <p>{texto}</p>
      <ul className="sobre-lista">
        {itens.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  )
}

export default function Sobre() {
  // Índice lateral: destaca o capítulo que está na faixa de leitura (perto do topo da tela)
  const [ativo, setAtivo] = useState(capitulos[0].id)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const observador = new IntersectionObserver(
      (entradas) => {
        const naFaixa = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (naFaixa.length > 0) setAtivo(naFaixa[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    capitulos.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [])

  return (
    <div className="home sobre">
      <main>
        <section className="sobre-hero" aria-labelledby="sobre-titulo-pagina" data-nav-tema="escura">
          <div className="home-container sobre-hero-grid">
            <div>
              <h1 id="sobre-titulo-pagina" className="sobre-hero-titulo">
                Os atrativos de Jaboatão merecem ser mais conhecidos.
              </h1>
              <p className="sobre-hero-texto">
                O <strong>Jaboatão 360</strong> é uma plataforma web, e futuramente mobile, que
                reúne em um só lugar os principais atrativos turísticos de Jaboatão dos Guararapes.
              </p>
            </div>

            {/* O 360 do nome vira um círculo: a foto dentro de uma escala de graus */}
            <div className="sobre-disco">
              <span className="sobre-dial" aria-hidden="true" />
              <Foto
                nome="pilar"
                alt="Fachada barroca de igreja com duas torres, frontão ornamentado e portas verdes"
                prioridade
                className="sobre-foto-disco"
              />
            </div>
          </div>
        </section>

        <div className="home-section sobre-corpo" data-nav-tema="clara">
          <div className="home-container sobre-grid">
            <nav className="sobre-indice" aria-label="Nesta página">
              <p className="sobre-indice-titulo">Nesta página</p>
              <ul>
                {capitulos.map(({ id, rotulo }) => (
                  <li key={id}>
                    <a href={`#${id}`} aria-current={ativo === id ? 'location' : undefined}>
                      {rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sobre-capitulos">
              <section id="problematica" className="sobre-capitulo" aria-labelledby="problematica-titulo">
                <h2 id="problematica-titulo" className="sobre-h2">A problemática</h2>
                <div className="sobre-prosa">
                  <p className="sobre-lead">
                    Jaboatão dos Guararapes é o segundo município mais populoso de Pernambuco e
                    possui um rico patrimônio histórico, cultural e natural: praias, parques,
                    igrejas históricas e marcos das Batalhas dos Guararapes.
                  </p>
                  <p>
                    Apesar disso, grande parte desses atrativos permanece pouco conhecida, tanto
                    por moradores quanto por visitantes, pela falta de uma plataforma acessível e
                    centralizada de informações turísticas.
                  </p>
                </div>
              </section>

              <section id="motivacao" className="sobre-capitulo" aria-labelledby="motivacao-titulo">
                <h2 id="motivacao-titulo" className="sobre-h2">Motivação</h2>
                <div className="sobre-prosa">
                  <p className="sobre-lead">
                    O projeto nasceu da vontade de valorizar o município e aproximar as pessoas
                    dos espaços que ele oferece.
                  </p>
                  <p>
                    A tecnologia é usada como ferramenta para ampliar a visibilidade dos atrativos
                    locais, incentivar o turismo sustentável e fortalecer o comércio e os
                    empreendedores da região.
                  </p>
                </div>
              </section>

              <section id="objetivos" className="sobre-capitulo" aria-labelledby="objetivos-titulo">
                <h2 id="objetivos-titulo" className="sobre-h2">Objetivos</h2>
                <ul className="sobre-lista sobre-objetivos">
                  {objetivos.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </section>

              <section id="proposta" className="sobre-capitulo" aria-labelledby="proposta-titulo">
                <h2 id="proposta-titulo" className="sobre-h2">Nossa proposta</h2>
                <div className="sobre-prosa">
                  <p>
                    A plataforma oferece mapa interativo e informações detalhadas sobre cada
                    atrativo. Em versões futuras, terá roteiros personalizados por inteligência
                    artificial e um sistema de gamificação para incentivar a exploração da cidade.
                  </p>
                </div>
                <Foto
                  nome="hero"
                  alt="Lago de águas calmas cercado por paredões de rocha e vegetação, sob céu azul"
                  className="sobre-figura"
                />
                <div className="sobre-publicos">
                  <Publico
                    id="publico-visitantes"
                    titulo="Para turistas e moradores"
                    texto="Conhecer a cidade em um único lugar:"
                    itens={paraVisitantes}
                  />
                  <Publico
                    id="publico-empreendedores"
                    titulo="Para empreendedores locais"
                    texto="O projeto quer fortalecer o comércio e os empreendedores da região:"
                    itens={paraEmpreendedores}
                  />
                </div>
                <p className="sobre-despedida">Boa visita a Jaboatão!</p>
              </section>

              <section id="contexto" className="sobre-capitulo" aria-labelledby="contexto-titulo">
                <h2 id="contexto-titulo" className="sobre-h2">Um projeto acadêmico</h2>
                <div className="sobre-prosa">
                  <p>
                    Este MVP foi desenvolvido como projeto prático do curso de{' '}
                    <strong>Análise e Desenvolvimento de Sistemas (ADS)</strong>, aplicando
                    conhecimentos em:
                  </p>
                </div>
                <dl className="sobre-stack">
                  {tecnologias.map(({ grupo, itens }) => (
                    <div key={grupo}>
                      <dt>{grupo}</dt>
                      <dd>{itens}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </div>

        <CtaBand
          titulo="Conheça os atrativos de Jaboatão"
          texto="Veja no mapa as praias, igrejas, parques e marcos históricos reunidos no projeto."
          acao={{ to: '/mapa', rotulo: 'Ver o mapa' }}
        />
      </main>
      <Footer />
    </div>
  )
}
