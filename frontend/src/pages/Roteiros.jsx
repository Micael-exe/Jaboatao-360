import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { catalogo, buscarItem } from '../data/dados'

const rascunhoVazio = { id: null, nome: '', data: '', paradas: [] }

// Id único sem depender de backend
const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

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
    const uid = `${ref}-${novoId()}`
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
      setSalvos((lista) => [{ ...rascunho, id: novoId() }, ...lista])
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
      { ...roteiro, id: novoId(), nome: `${roteiro.nome} (cópia)` },
      ...lista,
    ])

  const excluir = (id) => {
    setSalvos((lista) => lista.filter((r) => r.id !== id))
    if (rascunho.id === id) setRascunho(rascunhoVazio)
  }

  return (
    <main className="page">
      <h1 className="page-title">Planejamento de roteiros</h1>
      <p className="page-lead">
        Monte seu passeio escolhendo atrativos e comércios, organize a ordem e salve para depois.
      </p>

      <div className="notice">
        Dados demonstrativos — os roteiros ficam salvos apenas neste navegador.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Catálogo */}
        <section className="panel">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Escolha as paradas</h2>
          <div className="flex gap-2 mb-4">
            {filtros.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`chip ${filtro === f ? 'chip-on' : ''}`}
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
                  className="text-xs btn"
                >
                  + Adicionar
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Editor */}
        <section className="panel">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800">
              {rascunho.id ? 'Editando roteiro' : 'Novo roteiro'}
            </h2>
            {rascunho.id && (
              <span className="tag">
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
              className="input"
            />
            <input
              type="date"
              value={rascunho.data}
              onChange={(e) => atualizar({ data: e.target.value })}
              className="input"
            />
          </div>

          {rascunho.paradas.length === 0 ? (
            <div className="text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl py-10 mb-4">
              <div className="tile">🧭</div>
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
                      className="input input-sm"
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
              className="btn"
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
                className="card flex flex-col"
              >
                <div className="tile">🗺️</div>
                <span className="tag">
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
