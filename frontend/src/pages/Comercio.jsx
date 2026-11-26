import PaginaGuia from '../components/PaginaGuia'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useDadosConta from '../hooks/useLocalStorage'
import { comercios } from '../data/dados'

const tipos = ['Todos', 'Estabelecimento', 'Experiência']
const categorias = ['Todas', ...new Set(comercios.map((c) => c.categoria))]

export default function Comercio() {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('Todos')
  const [categoria, setCategoria] = useState('Todas')
  const [favoritos, setFavoritos] = useDadosConta('j360_favoritos_comercio', [])
  const [rascunho, setRascunho] = useDadosConta('j360_rascunho', {
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
    `chip ${ativo ? 'chip-on' : ''}`

  return (
    <PaginaGuia pagina="comercio" titulo="Comércio local"
      descricao="Descubra estabelecimentos e experiências perto dos atrativos de Jaboatão.">
      <div className="notice">
        Dados demonstrativos — os estabelecimentos exibidos são fictícios (MVP acadêmico).
      </div>

      <div className="guia-colunas">
        <section className="guia-secao guia-filtros" aria-label="Filtros do comércio">
          <h2>Filtrar locais</h2>
          <div>
            <label htmlFor="comercio-busca">Busca</label>
            <input id="comercio-busca" type="search" value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, bairro ou atrativo próximo" className="input" />
          </div>
          <fieldset>
            <legend>Tipo</legend>
            <div className="guia-opcoes">{tipos.map((t) => (
              <button key={t} onClick={() => setTipo(t)} aria-pressed={tipo === t} className={chip(tipo === t)}>{t}</button>
            ))}</div>
          </fieldset>
          <fieldset>
            <legend>Categoria</legend>
            <div className="guia-opcoes">{categorias.map((c) => (
              <button key={c} onClick={() => setCategoria(c)} aria-pressed={categoria === c} className={chip(categoria === c)}>{c}</button>
            ))}</div>
          </fieldset>
        </section>

        {/* Lista */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {lista.length} {lista.length === 1 ? 'resultado' : 'resultados'}
          </h2>

          {lista.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum local encontrado com esses filtros.</p>
          ) : (
            <div className="guia-lista">
              {lista.map((c) => {
                const favorito = favoritos.includes(c.id)
                return (
                  <article key={c.id} className="guia-ficha">
                    <div className="flex w-full items-center gap-2 justify-between">
                      <span className="tag">{c.tipo} · {c.categoria}</span>
                      <button
                        onClick={() => alternarFavorito(c.id)}
                        aria-label={favorito ? 'Remover dos favoritos' : 'Favoritar'}
                        aria-pressed={favorito}
                        className="fav"
                      >
                        <span aria-hidden="true">{favorito ? '♥' : '♡'}</span>
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">{c.nome}</h3>
                    <p className="text-gray-500 text-sm mb-3">{c.descricao}</p>

                    <dl>
                      <dt>Onde fica</dt><dd>{c.bairro} · perto de {c.proximoA}</dd>
                      <dt>Horário</dt><dd>{c.horario}</dd>
                      <dt>Preço</dt><dd>{c.preco}</dd>
                    </dl>

                    <button
                      onClick={() => adicionarAoRoteiro(c.id)}
                      className="btn"
                    >
                      {adicionado === c.id ? '✓ Adicionado!' : '+ Adicionar ao roteiro'}
                    </button>
                  </article>
                )
              })}
            </div>
          )}

          {rascunho.paradas.length > 0 && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-700">
                Seu roteiro em andamento tem <strong>{rascunho.paradas.length}</strong>{' '}
                {rascunho.paradas.length === 1 ? 'parada' : 'paradas'}.
              </p>
              <Link
                to="/roteiros"
                className="btn"
              >
                Ver roteiro
              </Link>
            </div>
          )}
        </section>
      </div>
    </PaginaGuia>
  )
}
