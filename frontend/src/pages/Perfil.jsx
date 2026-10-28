import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { atrativos, interessesDisponiveis } from '../data/dados'

const abas = [
  { id: 'conta', label: '👤 Conta' },
  { id: 'preferencias', label: '⚙️ Preferências' },
  { id: 'historico', label: '📖 Histórico de visitas' },
]

const avatares = ['😀', '🧑‍🌾', '🧳', '🏖️', '🦜', '🌴']

const contaInicial = {
  nome: 'Visitante Jaboatão',
  email: 'visitante@exemplo.com',
  cidade: 'Jaboatão dos Guararapes',
  tipoUsuario: 'Morador',
  avatar: '😀',
}

const preferenciasIniciais = {
  interesses: ['praias', 'historia'],
  ritmo: 'moderado',
  orcamento: '$$',
  notificacoes: { novidades: true, roteiros: true, comercio: false },
}

const visitasIniciais = [
  { id: 1, atrativoId: 'a-1', data: '2026-09-12', nota: 'Dia lindo, água calma!' },
  { id: 2, atrativoId: 'a-4', data: '2026-08-02', nota: 'Visita guiada muito boa.' },
]

const inputClasse =
  'input'

export default function Perfil() {
  const [aba, setAba] = useState('conta')
  const [conta, setConta] = useLocalStorage('j360_conta', contaInicial)
  const [prefs, setPrefs] = useLocalStorage('j360_preferencias', preferenciasIniciais)
  const [visitas, setVisitas] = useLocalStorage('j360_visitas', visitasIniciais)
  const [roteiros] = useLocalStorage('j360_roteiros', [])
  const [favoritos] = useLocalStorage('j360_favoritos_comercio', [])

  const [formConta, setFormConta] = useState(conta)
  const [salvoConta, setSalvoConta] = useState(false)
  const [novaVisita, setNovaVisita] = useState({ atrativoId: atrativos[0].id, data: '', nota: '' })

  const nomeAtrativo = (id) => atrativos.find((a) => a.id === id)

  const salvarConta = (e) => {
    e.preventDefault()
    setConta(formConta)
    setSalvoConta(true)
    setTimeout(() => setSalvoConta(false), 2500)
  }

  const alternarInteresse = (id) =>
    setPrefs((p) => ({
      ...p,
      interesses: p.interesses.includes(id)
        ? p.interesses.filter((i) => i !== id)
        : [...p.interesses, id],
    }))

  const alternarNotificacao = (chave) =>
    setPrefs((p) => ({
      ...p,
      notificacoes: { ...p.notificacoes, [chave]: !p.notificacoes[chave] },
    }))

  const registrarVisita = (e) => {
    e.preventDefault()
    if (!novaVisita.data) return
    setVisitas((v) => [{ ...novaVisita, id: Date.now() }, ...v])
    setNovaVisita({ atrativoId: atrativos[0].id, data: '', nota: '' })
  }

  const visitasOrdenadas = [...visitas].sort((a, b) => b.data.localeCompare(a.data))
  const atrativosUnicos = new Set(visitas.map((v) => v.atrativoId)).size

  const estatisticas = [
    { emoji: '📍', valor: visitas.length, label: 'Visitas' },
    { emoji: '🗺️', valor: `${atrativosUnicos}/${atrativos.length}`, label: 'Atrativos conhecidos' },
    { emoji: '🧭', valor: roteiros.length, label: 'Roteiros salvos' },
    { emoji: '❤️', valor: favoritos.length, label: 'Favoritos' },
  ]

  return (
    <main className="page">
      <h1 className="page-title">Perfil do usuário</h1>
      <p className="page-lead">
        Gerencie sua conta, ajuste suas preferências e acompanhe os lugares que já visitou.
      </p>

      <div className="notice">
        Dados demonstrativos — as informações ficam salvas apenas neste navegador, sem login real.
      </div>

      {/* Cabeçalho do perfil */}
      <section className="panel mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="text-5xl bg-green-50 border border-green-200 rounded-full w-20 h-20 flex items-center justify-center">
            {conta.avatar}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{conta.nome}</h2>
            <p className="text-sm text-gray-500">{conta.email}</p>
            <span className="tag">
              {conta.tipoUsuario}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {estatisticas.map((s) => (
            <div key={s.label} className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <div className="text-2xl">{s.emoji}</div>
              <div className="text-xl font-bold text-green-700">{s.valor}</div>
              <div className="text-xs text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Abas */}
      <div className="flex flex-wrap gap-2 mb-6">
        {abas.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`chip ${aba === a.id ? 'chip-on' : ''}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Conta */}
      {aba === 'conta' && (
        <form
          onSubmit={salvarConta}
          className="panel space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-800">Dados da conta</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Avatar</label>
            <div className="flex gap-2">
              {avatares.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setFormConta({ ...formConta, avatar: a })}
                  className={`avatar-btn ${formConta.avatar === a ? 'avatar-on' : ''}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nome</label>
              <input
                className={inputClasse}
                value={formConta.nome}
                onChange={(e) => setFormConta({ ...formConta, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                className={inputClasse}
                value={formConta.email}
                onChange={(e) => setFormConta({ ...formConta, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cidade</label>
              <input
                className={inputClasse}
                value={formConta.cidade}
                onChange={(e) => setFormConta({ ...formConta, cidade: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Perfil</label>
              <select
                className={inputClasse}
                value={formConta.tipoUsuario}
                onChange={(e) => setFormConta({ ...formConta, tipoUsuario: e.target.value })}
              >
                <option>Morador</option>
                <option>Turista</option>
                <option>Empreendedor</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="btn"
            >
              Salvar alterações
            </button>
            {salvoConta && <span className="text-sm text-green-700">✅ Dados atualizados!</span>}
          </div>
        </form>
      )}

      {/* Preferências */}
      {aba === 'preferencias' && (
        <div className="space-y-6">
          <section className="panel">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Meus interesses</h2>
            <div className="flex flex-wrap gap-2">
              {interessesDisponiveis.map((i) => {
                const ativo = prefs.interesses.includes(i.id)
                return (
                  <button
                    key={i.id}
                    onClick={() => alternarInteresse(i.id)}
                    className={`chip ${ativo ? 'chip-on' : ''}`}
                  >
                    {i.emoji} {i.label}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="panel grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Ritmo dos passeios
              </label>
              <select
                className={inputClasse}
                value={prefs.ritmo}
                onChange={(e) => setPrefs({ ...prefs, ritmo: e.target.value })}
              >
                <option value="tranquilo">Tranquilo (poucas paradas)</option>
                <option value="moderado">Moderado</option>
                <option value="intenso">Intenso (muitas paradas)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Faixa de gastos
              </label>
              <select
                className={inputClasse}
                value={prefs.orcamento}
                onChange={(e) => setPrefs({ ...prefs, orcamento: e.target.value })}
              >
                <option value="$">$ — Econômico</option>
                <option value="$$">$$ — Intermediário</option>
                <option value="$$$">$$$ — Premium</option>
              </select>
            </div>
          </section>

          <section className="panel">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Notificações</h2>
            <div className="space-y-2 text-sm text-gray-700">
              {[
                ['novidades', 'Novidades e novos atrativos'],
                ['roteiros', 'Lembretes dos meus roteiros'],
                ['comercio', 'Ofertas do comércio local'],
              ].map(([chave, label]) => (
                <label key={chave} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.notificacoes[chave]}
                    onChange={() => alternarNotificacao(chave)}
                    className="accent-green-700 w-4 h-4"
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">As alterações são salvas automaticamente.</p>
          </section>
        </div>
      )}

      {/* Histórico */}
      {aba === 'historico' && (
        <div className="space-y-6">
          <form
            onSubmit={registrarVisita}
            className="panel"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-3">Registrar nova visita</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <select
                className={inputClasse}
                value={novaVisita.atrativoId}
                onChange={(e) => setNovaVisita({ ...novaVisita, atrativoId: e.target.value })}
              >
                {atrativos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.emoji} {a.nome}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className={inputClasse}
                value={novaVisita.data}
                onChange={(e) => setNovaVisita({ ...novaVisita, data: e.target.value })}
                required
              />
            </div>
            <input
              className={`${inputClasse} mb-3`}
              placeholder="Anotação (opcional)"
              value={novaVisita.nota}
              onChange={(e) => setNovaVisita({ ...novaVisita, nota: e.target.value })}
            />
            <button
              type="submit"
              className="btn"
            >
              + Registrar visita
            </button>
          </form>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitas realizadas</h2>
            {visitasOrdenadas.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma visita registrada ainda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visitasOrdenadas.map((v) => {
                  const a = nomeAtrativo(v.atrativoId)
                  return (
                    <div
                      key={v.id}
                      className="card"
                    >
                      <div className="tile">{a?.emoji}</div>
                      <span className="tag">
                        {new Date(v.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">{a?.nome}</h3>
                      {v.nota && <p className="text-gray-500 text-sm mb-3">“{v.nota}”</p>}
                      <button
                        onClick={() => setVisitas((lista) => lista.filter((x) => x.id !== v.id))}
                        className="text-sm text-red-600 font-medium hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
