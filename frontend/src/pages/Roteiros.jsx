import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { catalogo, buscarItem } from '../data/dados'

const rascunhoVazio = { id: null, nome: '', data: '', paradas: [] }

export default function Roteiros() {
  const [rascunho, setRascunho] = useLocalStorage('j360_rascunho', rascunhoVazio)
  const [salvos, setSalvos] = useLocalStorage('j360_roteiros', [])
  const [filtro, setFiltro] = useState('Todos')
  const [mensagem, setMensagem] = useState('')

  const filtros = ['Todos', 'Atrativo', 'Comércio']
  const itensFiltrados = catalogo.filter((i) => filtro === 'Todos' || i.origem === filtro)

  const avisar = (texto) => {
    setMensagem(texto)
    setTimeout(() => setMensagem(''), 2500)
  }

  const atualizar = (campos) => setRascunho((r) => ({ ...r, ...campos }))

  const adicionarParada = (ref) => {
    const uid = `${ref}-${Date.now()}`
    setRascunho((r) => ({ ...r, paradas: [...r.paradas, { uid, ref, hora: '' }] }))
  }

  const removerParada = (uid) =>
    setRascunho((r) => ({ ...r, paradas: r.paradas.filter((p) => p.uid !== uid) }))

  const alterarHora = (uid, hora) =>
    setRascunho((r) => ({
      ...r,
      paradas: r.paradas.map((p) => (p.uid === uid ? { ...p, hora } : p)),
    }))

  const mover = (index, direcao) =>
    setRascunho((r) => {
      const destino = index + direcao
      if (destino < 0 || destino >= r.paradas.length) return r
      const paradas = [...r.paradas]
      ;[paradas[index], paradas[destino]] = [paradas[destino], paradas[index]]
      return { ...r, paradas }
    })

  const salvar = () => {
    if (!rascunho.nome.trim()) return avisar('⚠️ Dê um nome ao seu roteiro.')
    if (rascunho.paradas.length === 0) return avisar('⚠️ Adicione ao menos uma parada.')

    if (rascunho.id) {
      setSalvos((lista) => lista.map((r) => (r.id === rascunho.id ? rascunho : r)))
    } else {
      setSalvos((lista) => [{ ...rascunho, id: Date.now() }, ...lista])
    }
    setRascunho(rascunhoVazio)
    avisar('✅ Roteiro salvo com sucesso!')
  }

  const editar = (roteiro) => {
    setRascunho(roteiro)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const duplicar = (roteiro) =>
    setSalvos((lista) => [
      { ...roteiro, id: Date.now(), nome: `${roteiro.nome} (cópia)` },
      ...lista,
    ])

  const excluir = (id) => {
    setSalvos((lista) => lista.filter((r) => r.id !== id))
    if (rascunho.id === id) setRascunho(rascunhoVazio)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-2">Planejamento de roteiros</h1>
      <p className="text-gray-500 text-sm mb-4">
        Monte seu passeio escolhendo atrativos e comércios, organize a ordem e salve para depois.
      </p>

      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3 mb-8">
        ⚠️ Dados demonstrativos — os roteiros ficam salvos apenas neste navegador.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Catálogo */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Escolha as paradas</h2>
          <div className="flex gap-2 mb-4">
            {filtros.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
                  filtro === f
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {itensFiltrados.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 hover:bg-green-50 transition-colors"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{item.nome}</p>
                  <p className="text-xs text-gray-500">
                    {item.origem} · {item.categoria}
                  </p>
                </div>
                <button
                  onClick={() => adicionarParada(item.id)}
                  className="text-xs bg-green-700 text-white font-semibold px-3 py-1.5 rounded-full hover:bg-green-800 transition-colors"
                >
                  + Adicionar
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Editor */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">
              {rascunho.id ? 'Editando roteiro' : 'Novo roteiro'}
            </h2>
            {rascunho.id && (
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Salvo anteriormente
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              value={rascunho.nome}
              onChange={(e) => atualizar({ nome: e.target.value })}
              placeholder="Nome do roteiro"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="date"
              value={rascunho.data}
              onChange={(e) => atualizar({ data: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {rascunho.paradas.length === 0 ? (
            <div className="text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl py-10 mb-4">
              <div className="text-3xl mb-2">🧭</div>
              Nenhuma parada ainda. Adicione itens da lista ao lado.
            </div>
          ) : (
            <ol className="space-y-2 mb-4">
              {rascunho.paradas.map((p, i) => {
                const item = buscarItem(p.ref)
                if (!item) return null
                return (
                  <li
                    key={p.uid}
                    className="flex items-center gap-2 border border-gray-200 rounded-xl p-2.5"
                  >
                    <span className="bg-green-700 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xl">{item.emoji}</span>
                    <p className="flex-1 min-w-0 text-sm font-semibold text-gray-800 truncate">
                      {item.nome}
                    </p>
                    <input
                      type="time"
                      value={p.hora}
                      onChange={(e) => alterarHora(p.uid, e.target.value)}
                      aria-label="Horário"
                      className="border border-gray-300 rounded-lg px-1.5 py-1 text-xs"
                    />
                    <div className="flex gap-1 text-gray-500">
                      <button
                        onClick={() => mover(i, -1)}
                        disabled={i === 0}
                        aria-label="Subir"
                        className="px-1.5 hover:text-green-700 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => mover(i, 1)}
                        disabled={i === rascunho.paradas.length - 1}
                        aria-label="Descer"
                        className="px-1.5 hover:text-green-700 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removerParada(p.uid)}
                        aria-label="Remover"
                        className="px-1.5 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={salvar}
              className="bg-green-700 text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-green-800 transition-colors"
            >
              {rascunho.id ? 'Atualizar roteiro' : 'Salvar roteiro'}
            </button>
            <button
              onClick={() => setRascunho(rascunhoVazio)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Limpar
            </button>
            {mensagem && <span className="text-sm text-gray-600">{mensagem}</span>}
          </div>
        </section>
      </div>

      {/* Salvos */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus roteiros salvos</h2>
        {salvos.length === 0 ? (
          <p className="text-gray-500 text-sm">Você ainda não salvou nenhum roteiro.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {salvos.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="text-3xl mb-2">🗺️</div>
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                  {r.paradas.length} {r.paradas.length === 1 ? 'parada' : 'paradas'}
                  {r.data && ` · ${new Date(r.data + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">{r.nome}</h3>
                <ul className="text-gray-500 text-sm space-y-1 mb-4 flex-1">
                  {r.paradas.slice(0, 4).map((p) => {
                    const item = buscarItem(p.ref)
                    return (
                      <li key={p.uid}>
                        {item?.emoji} {p.hora && <strong>{p.hora} </strong>}
                        {item?.nome}
                      </li>
                    )
                  })}
                  {r.paradas.length > 4 && <li>+ {r.paradas.length - 4} paradas…</li>}
                </ul>
                <div className="flex gap-3 text-sm font-medium">
                  <button onClick={() => editar(r)} className="text-green-700 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => duplicar(r)} className="text-green-700 hover:underline">
                    Duplicar
                  </button>
                  <button onClick={() => excluir(r.id)} className="text-red-600 hover:underline">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
