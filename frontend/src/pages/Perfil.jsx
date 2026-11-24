import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import CtaBand from '../components/home/CtaBand'
import Footer from '../components/Footer'
import { atrativos, interessesDisponiveis } from '../data/dados'
import './Home.css' // tokens de cor, container, botões e chamada final compartilhados com a home
import './Sobre.css' // topo com escala de graus, índice lateral e títulos de seção
import './Perfil.css'

const secoes = [
  { id: 'conta', rotulo: 'Conta' },
  { id: 'preferencias', rotulo: 'Preferências' },
  { id: 'historico', rotulo: 'Histórico de visitas' },
]

// Cores do avatar: todas vêm da paleta do projeto
const tonsAvatar = [
  { id: 'espuma', rotulo: 'Espuma' },
  { id: 'sol', rotulo: 'Sol' },
  { id: 'vivo', rotulo: 'Verde-maré' },
  { id: 'claro', rotulo: 'Verde claro' },
]

const contaInicial = {
  nome: 'Visitante Jaboatão',
  email: 'visitante@exemplo.com',
  cidade: 'Jaboatão dos Guararapes',
  tipoUsuario: 'Turista',
  avatar: 'espuma',
}

const tiposConta = ['Turista', 'Empreendedor', 'Empresa']
// Valores antigos (como "Morador") caem em Turista
const tipoValido = (tipo) => (tiposConta.includes(tipo) ? tipo : 'Turista')

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

const notificacoes = [
  ['novidades', 'Novidades e novos atrativos'],
  ['roteiros', 'Lembretes dos meus roteiros'],
  ['comercio', 'Ofertas do comércio local'],
]

const iniciais = (nome) => {
  const partes = nome.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return 'J'
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (partes[0][0] + ultima).toUpperCase()
}

// Valores antigos (emoji salvo no navegador) caem na cor padrão
const tomValido = (tom) => (tonsAvatar.some((t) => t.id === tom) ? tom : 'espuma')

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

  const buscarAtrativo = (id) => atrativos.find((a) => a.id === id)

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

  const numeros = [
    { valor: visitas.length, rotulo: 'Visitas' },
    { valor: `${atrativosUnicos}/${atrativos.length}`, rotulo: 'Atrativos conhecidos' },
    { valor: roteiros.length, rotulo: 'Roteiros salvos' },
    { valor: favoritos.length, rotulo: 'Favoritos' },
  ]

  return (
    <div className="home sobre perfil">
      <main>
        <section className="sobre-hero" aria-labelledby="perfil-titulo-pagina" data-nav-tema="escura">
          <div className="home-container sobre-hero-grid">
            <div>
              <p className="perfil-eyebrow">Perfil</p>
              <h1 id="perfil-titulo-pagina" className="sobre-hero-titulo">{conta.nome}</h1>
              <p className="sobre-hero-texto">
                {tipoValido(conta.tipoUsuario)}
                {conta.cidade ? `, ${conta.cidade}` : ''}. {conta.email}
              </p>
              <dl className="home-stats" aria-label="Seu resumo no Jaboatão 360">
                {numeros.map(({ valor, rotulo }) => (
                  <div key={rotulo} className="home-stat">
                    <dt>{rotulo}</dt>
                    <dd>{valor}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* O avatar vira um disco dentro da escala de graus, como na página Sobre */}
            <div className="sobre-disco perfil-disco">
              <span className="sobre-dial" aria-hidden="true" />
              <span className={`perfil-avatar perfil-tom--${tomValido(conta.avatar)}`} aria-hidden="true">
                {iniciais(conta.nome)}
              </span>
            </div>
          </div>
        </section>

        <div className="home-section sobre-corpo" data-nav-tema="clara">
          <div className="home-container sobre-grid">
            <nav className="sobre-indice perfil-indice" aria-label="Seções do perfil">
              <p className="sobre-indice-titulo">Seu perfil</p>
              <ul>
                {secoes.map(({ id, rotulo }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setAba(id)}
                      aria-current={aba === id ? 'true' : undefined}
                    >
                      {rotulo}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="perfil-conteudo">
              <p className="notice">
                Dados demonstrativos: as informações ficam salvas apenas neste navegador, sem login real.
              </p>

              {aba === 'conta' && (
                <section aria-labelledby="perfil-conta-titulo">
                  <h2 id="perfil-conta-titulo" className="sobre-h2">Dados da conta</h2>
                  <form onSubmit={salvarConta} className="perfil-form">
                    <fieldset className="perfil-tons">
                      <legend>Cor do avatar</legend>
                      <div className="perfil-tons-lista">
                        {tonsAvatar.map((t) => (
                          <button
                            type="button"
                            key={t.id}
                            aria-label={`Cor do avatar: ${t.rotulo}`}
                            aria-pressed={tomValido(formConta.avatar) === t.id}
                            onClick={() => setFormConta({ ...formConta, avatar: t.id })}
                            className={`perfil-tom perfil-tom--${t.id}`}
                          />
                        ))}
                      </div>
                    </fieldset>

                    <div className="perfil-campos">
                      <div className="perfil-campo">
                        <label htmlFor="perfil-nome">Nome</label>
                        <input
                          id="perfil-nome"
                          className="input"
                          value={formConta.nome}
                          onChange={(e) => setFormConta({ ...formConta, nome: e.target.value })}
                          required
                        />
                      </div>
                      <div className="perfil-campo">
                        <label htmlFor="perfil-email">E-mail</label>
                        <input
                          id="perfil-email"
                          type="email"
                          className="input"
                          value={formConta.email}
                          onChange={(e) => setFormConta({ ...formConta, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="perfil-campo">
                        <label htmlFor="perfil-cidade">Cidade</label>
                        <input
                          id="perfil-cidade"
                          className="input"
                          value={formConta.cidade}
                          onChange={(e) => setFormConta({ ...formConta, cidade: e.target.value })}
                        />
                      </div>
                      <div className="perfil-campo">
                        <label htmlFor="perfil-tipo">Perfil</label>
                        <select
                          id="perfil-tipo"
                          className="input"
                          value={tipoValido(formConta.tipoUsuario)}
                          onChange={(e) => setFormConta({ ...formConta, tipoUsuario: e.target.value })}
                        >
                          {tiposConta.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      {tipoValido(formConta.tipoUsuario) !== 'Turista' && (
                        <div className="perfil-campo">
                          <label htmlFor="perfil-negocio">
                            {tipoValido(formConta.tipoUsuario) === 'Empresa' ? 'Nome da empresa' : 'Nome do negócio'}
                          </label>
                          <input
                            id="perfil-negocio"
                            className="input"
                            value={formConta.negocio ?? ''}
                            onChange={(e) => setFormConta({ ...formConta, negocio: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    <div className="perfil-acoes">
                      <button type="submit" className="home-btn home-btn--verde">
                        Salvar alterações
                      </button>
                      {salvoConta && (
                        <span className="perfil-status" role="status">Dados atualizados.</span>
                      )}
                    </div>
                  </form>
                </section>
              )}

              {aba === 'preferencias' && (
                <section aria-labelledby="perfil-prefs-titulo">
                  <h2 id="perfil-prefs-titulo" className="sobre-h2">Preferências</h2>

                  <div className="perfil-bloco">
                    <h3 className="perfil-h3">Meus interesses</h3>
                    <div className="perfil-chips">
                      {interessesDisponiveis.map((i) => {
                        const ativo = prefs.interesses.includes(i.id)
                        return (
                          <button
                            type="button"
                            key={i.id}
                            aria-pressed={ativo}
                            onClick={() => alternarInteresse(i.id)}
                            className={`chip ${ativo ? 'chip-on' : ''}`}
                          >
                            {i.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="perfil-bloco">
                    <h3 className="perfil-h3">Passeios</h3>
                    <div className="perfil-campos">
                      <div className="perfil-campo">
                        <label htmlFor="perfil-ritmo">Ritmo dos passeios</label>
                        <select
                          id="perfil-ritmo"
                          className="input"
                          value={prefs.ritmo}
                          onChange={(e) => setPrefs({ ...prefs, ritmo: e.target.value })}
                        >
                          <option value="tranquilo">Tranquilo (poucas paradas)</option>
                          <option value="moderado">Moderado</option>
                          <option value="intenso">Intenso (muitas paradas)</option>
                        </select>
                      </div>
                      <div className="perfil-campo">
                        <label htmlFor="perfil-orcamento">Faixa de gastos</label>
                        <select
                          id="perfil-orcamento"
                          className="input"
                          value={prefs.orcamento}
                          onChange={(e) => setPrefs({ ...prefs, orcamento: e.target.value })}
                        >
                          <option value="$">$ — Econômico</option>
                          <option value="$$">$$ — Intermediário</option>
                          <option value="$$$">$$$ — Premium</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="perfil-bloco">
                    <h3 className="perfil-h3">Notificações</h3>
                    <ul className="sobre-lista perfil-notificacoes">
                      {notificacoes.map(([chave, rotulo]) => (
                        <li key={chave}>
                          <label>
                            <input
                              type="checkbox"
                              checked={prefs.notificacoes[chave]}
                              onChange={() => alternarNotificacao(chave)}
                            />
                            {rotulo}
                          </label>
                        </li>
                      ))}
                    </ul>
                    <p className="perfil-nota">As alterações são salvas automaticamente.</p>
                  </div>
                </section>
              )}

              {aba === 'historico' && (
                <section aria-labelledby="perfil-hist-titulo">
                  <h2 id="perfil-hist-titulo" className="sobre-h2">Histórico de visitas</h2>

                  <form onSubmit={registrarVisita} className="perfil-form perfil-bloco">
                    <h3 className="perfil-h3">Registrar nova visita</h3>
                    <div className="perfil-campos">
                      <div className="perfil-campo">
                        <label htmlFor="visita-atrativo">Atrativo</label>
                        <select
                          id="visita-atrativo"
                          className="input"
                          value={novaVisita.atrativoId}
                          onChange={(e) => setNovaVisita({ ...novaVisita, atrativoId: e.target.value })}
                        >
                          {atrativos.map((a) => (
                            <option key={a.id} value={a.id}>{a.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div className="perfil-campo">
                        <label htmlFor="visita-data">Data da visita</label>
                        <input
                          id="visita-data"
                          type="date"
                          className="input"
                          value={novaVisita.data}
                          onChange={(e) => setNovaVisita({ ...novaVisita, data: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="perfil-campo">
                      <label htmlFor="visita-nota">Anotação (opcional)</label>
                      <input
                        id="visita-nota"
                        className="input"
                        value={novaVisita.nota}
                        onChange={(e) => setNovaVisita({ ...novaVisita, nota: e.target.value })}
                      />
                    </div>
                    <div className="perfil-acoes">
                      <button type="submit" className="home-btn home-btn--verde">
                        + Registrar visita
                      </button>
                    </div>
                  </form>

                  <div className="perfil-bloco">
                    <h3 className="perfil-h3">Visitas realizadas</h3>
                    {visitasOrdenadas.length === 0 ? (
                      <p className="perfil-vazio">Nenhuma visita registrada ainda.</p>
                    ) : (
                      <ul className="perfil-visitas">
                        {visitasOrdenadas.map((v) => {
                          const a = buscarAtrativo(v.atrativoId)
                          return (
                            <li key={v.id} className="perfil-visita">
                              <p className="perfil-visita-data">
                                {new Date(v.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                              </p>
                              <div className="perfil-visita-corpo">
                                <h4 className="perfil-visita-nome">{a?.nome}</h4>
                                {a && (
                                  <p className="perfil-visita-meta">{a.categoria}, {a.bairro}</p>
                                )}
                                {v.nota && <p className="perfil-visita-nota">“{v.nota}”</p>}
                              </div>
                              <button
                                type="button"
                                className="perfil-remover"
                                onClick={() => setVisitas((lista) => lista.filter((x) => x.id !== v.id))}
                              >
                                Remover
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        <CtaBand
          titulo="Monte seu próximo roteiro"
          texto="Escolha os lugares que quer visitar e salve o roteiro para consultar depois."
          acao={{ to: '/roteiros', rotulo: 'Montar roteiro' }}
        />
      </main>
      <Footer />
    </div>
  )
}
