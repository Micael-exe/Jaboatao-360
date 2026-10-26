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

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Descubra. Explore. Viva Jaboatão.
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          O <strong>Jaboatão 360</strong> é seu guia para conhecer os atrativos turísticos,
          culturais e naturais de Jaboatão dos Guararapes – PE.
        </p>
        <a
          href="/mapa"
          className="inline-block bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors"
        >
          Explorar o mapa →
        </a>
      </section>

      {/* Aviso demonstrativo */}
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3 mb-8 text-center">
        ⚠️ Os dados exibidos são demonstrativos e fazem parte do MVP acadêmico do projeto.
      </div>

      {/* Destaques */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Destaques turísticos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destaques.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{a.emoji}</div>
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                {a.categoria}
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">{a.nome}</h3>
              <p className="text-gray-500 text-sm">{a.descricao}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}