const destaques = [
  {
    id: 1,
    nome: 'Praia de Piedade',
    categoria: 'Praia',
    descricao: 'Uma das praias mais procuradas do litoral sul de Pernambuco, com águas calmas e boa infraestrutura.',
    emoji: '🏖️',
  },
  {
    id: 2,
    nome: 'Praia de Candeias',
    categoria: 'Praia',
    descricao: 'Praia urbana com calçadão, quiosques e agitação durante todo o ano.',
    emoji: '🌊',
  },
  {
    id: 3,
    nome: 'Igreja de Nossa Senhora do Pilar',
    categoria: 'Patrimônio histórico',
    descricao: 'Igreja do século XVII, símbolo da história colonial de Jaboatão dos Guararapes.',
    emoji: '⛪',
  },
  {
    id: 4,
    nome: 'Parque Histórico Nacional dos Guararapes',
    categoria: 'Parque',
    descricao: 'Palco das Batalhas dos Guararapes (1648–1649), marco da formação do Brasil. Patrimônio nacional.',
    emoji: '🏛️',
  },
  {
    id: 5,
    nome: 'Praia de Barra de Jangada',
    categoria: 'Praia',
    descricao: 'Praia tranquila na foz do Rio Jaboatão, popular entre famílias e pescadores locais.',
    emoji: '⛵',
  },
  {
    id: 6,
    nome: 'Morro da Conceição',
    categoria: 'Ponto cultural',
    descricao: 'Elevação com vista panorâmica e forte presença religiosa e cultural na região.',
    emoji: '⛰️',
  },
]

const onda = 'M0 70q180-60 360 0t360 0 360 0 360 0 360 0 360 0 360 0 360 0V160H0z'
const largos = [0, 3, 5]

export default function Home() {
  return (
    <main className="page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-sol" aria-hidden="true" />
        <h1 className="hero-title">
          <span>Descubra.</span>
          <span>Explore.</span>
          <span>Viva Jaboatão.</span>
        </h1>
        <p className="hero-texto">
          O <strong>Jaboatão 360</strong> é seu guia para conhecer os atrativos turísticos,
          culturais e naturais de Jaboatão dos Guararapes – PE.
        </p>
        <a href="/mapa" className="btn btn-lg">
          Explorar o mapa
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9h12M10 4l5 5-5 5" />
          </svg>
        </a>
        <div className="ondas" aria-hidden="true">
          {[['#bfe3da', 0.9], ['#5fb3a3', 0.8], ['#12665d', 1]].map(([cor, op]) => (
            <svg key={cor} className="onda" viewBox="0 0 2880 160" preserveAspectRatio="none">
              <path d={onda} fill={cor} opacity={op} />
            </svg>
          ))}
        </div>
      </section>

      {/* Aviso demonstrativo */}
      <div className="notice">
        Os dados exibidos são demonstrativos e fazem parte do MVP acadêmico do projeto.
      </div>

      {/* Destaques */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Destaques turísticos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destaques.map((a, i) => (
            <article
              key={a.id}
              className={`card dest ${i === 0 ? 'dest-dark' : ''} ${largos.includes(i) ? 'lg:col-span-2' : ''}`}
            >
              <div className="tile">{a.emoji}</div>
              <span className="tag">{a.categoria}</span>
              <h3 className="dest-nome">{a.nome}</h3>
              <p className="dest-desc">{a.descricao}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}
