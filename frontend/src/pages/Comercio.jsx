import { useState } from 'react'
import { Link } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import { comercios } from '../data/dados'

const tipos = ['Todos', 'Estabelecimento', 'Experiência']
const categorias = ['Todas', ...new Set(comercios.map((c) => c.categoria))]

export default function Comercio() {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('Todos')
  const [categoria, setCategoria] = useState('Todas')
  const [favoritos, setFavoritos] = useLocalStorage('j360_favoritos_comercio', [])
  const [rascunho, setRascunho] = useLocalStorage('j360_rascunho', {
    id: null,
    nome: '',
    data: '',
    paradas: [],
  })
  const [adicionado, setAdicionado] = useState(null)

  const lista = comercios.filter((c) => {
    const texto = `${c.nome} ${c.descricao} ${c.bairro} ${c.proximoA}`.toLowerCase()
    return (
      texto.includes(busca.toLowerCase()) &&
      (tipo === 'Todos' || c.tipo === tipo) &&
      (categoria === 'Todas' || c.categoria === categoria)
    )
  })

  const alternarFavorito = (id) =>
    setFavoritos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const adicionarAoRoteiro = (id) => {
    setRascunho((r) => ({
      ...r,
      paradas: [...r.paradas, { uid: `${id}-${Date.now()}`, ref: id, hora: '' }],
    }))
    setAdicionado(id)
    setTimeout(() => setAdicionado(null), 2000)
  }

  const chip = (ativo) =>
    `text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
      ativo
        ? 'bg-green-700 text-white border-green-700'
        : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
    }`

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-2">Comércio local</h1>
      <p className="text-gray-500 text-sm mb-4">
        Descubra estabelecimentos e experiências próximas aos atrativos de Jaboatão e apoie quem
        movimenta a cidade.
      </p>

      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3 mb-6">
        ⚠️ Dados demonstrativos — os estabelecimentos exibidos são fictícios (MVP acadêmico).
      </div>

      {/* Filtros */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-8 space-y-4">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔎 Buscar por nome, bairro ou atrativo próximo"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 w-16">Tipo</span>
          {tipos.map((t) => (
            <button key={t} onClick={() => setTipo(t)} className={chip(tipo === t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 w-16">Categoria</span>
          {categorias.map((c) => (
            <button key={c} onClick={() => setCategoria(c)} className={chip(categoria === c)}>
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Lista */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {lista.length} {lista.length === 1 ? 'resultado' : 'resultados'}
        </h2>

        {lista.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum local encontrado com esses filtros.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lista.map((c) => {
              const favorito = favoritos.includes(c.id)
              return (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-3">{c.emoji}</div>
                    <button
                      onClick={() => alternarFavorito(c.id)}
                      aria-label={favorito ? 'Remover dos favoritos' : 'Favoritar'}
                      className="text-xl"
                    >
                      {favorito ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                    {c.tipo} · {c.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">{c.nome}</h3>
                  <p className="text-gray-500 text-sm mb-3">{c.descricao}</p>

                  <ul className="text-xs text-gray-500 space-y-1 mb-4 flex-1">
                    <li>📍 {c.bairro} — perto de {c.proximoA}</li>
                    <li>🕒 {c.horario}</li>
                    <li>💰 {c.preco}</li>
                  </ul>

                  <button
                    onClick={() => adicionarAoRoteiro(c.id)}
                    className="bg-green-700 text-white text-sm font-semibold py-2 rounded-full hover:bg-green-800 transition-colors"
                  >
                    {adicionado === c.id ? '✓ Adicionado!' : '+ Adicionar ao roteiro'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {rascunho.paradas.length > 0 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-700">
              🧭 Seu roteiro em andamento tem <strong>{rascunho.paradas.length}</strong>{' '}
              {rascunho.paradas.length === 1 ? 'parada' : 'paradas'}.
            </p>
            <Link
              to="/roteiros"
              className="bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-green-800 transition-colors"
            >
              Ver roteiro →
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
