import { aguardarGravacao } from '../data/banco'
import useDadosConta from '../hooks/useLocalStorage'
import { buscarItem } from '../data/dados'
import PaginaGuia from '../components/PaginaGuia'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { interesses, filtrarLocais, carregarLocais, usaDemonstracao } from '../mapa/catalogo'
import { dias, hora, situacao } from '../mapa/horarios'
import { gerarRoteiro } from '../mapa/rotas'
import CartaoLugar from '../mapa/CartaoLugar'
import DetalheParada, { Semana } from '../mapa/DetalheParada'
import './Mapa.css'
import './Mapa-swipe.css'
import ExplorarMapa from '../mapa/ExplorarMapa'
import EscolherRoteiro from '../mapa/EscolherRoteiro'

const MapaFolha = lazy(() => import('../mapa/MapaFolha'))
const etapas = ['Interesses', 'Lugares', 'Partida', 'Roteiro']
const quantidade = n => `${n} ${n === 1 ? 'lugar' : 'lugares'}`

export default function Mapa() {
  const [modo, setModo] = useState("explorar")
  const [tipoRoteiro, setTipoRoteiro] = useState(null)
  const [nomeRoteiro, setNomeRoteiro] = useState('')
  const [etapa, mudarEtapa] = useState(0)
  const [respostas, responder] = useState({})
  const [lugares, listar] = useState(null)
  const [vistos, avancar] = useState(0)
  const [escolhas, escolher] = useState([])
  const [origem, definirOrigem] = useState(null)
  const [manual, abrirMapa] = useState(false)
  const [roteiro, mostrarRoteiro] = useState(null)
  const [ocupado, ocupar] = useState('')
  const [salvos, setSalvos] = useDadosConta('j360_roteiros', [])
  const [gravando, setGravando] = useState(false)
  const [erro, avisar] = useState('')
  const tarefa = useRef(null)
  const topo = useRef(null)
  const primeiraEtapa = useRef(etapa)

  useEffect(() => () => tarefa.current?.abort(), [])
  useEffect(() => {
    if (primeiraEtapa.current !== etapa) {
      primeiraEtapa.current = etapa
      topo.current?.focus()
    }
  }, [etapa])

  function cancelar() {
    tarefa.current?.abort()
    ocupar('')
    avisar('')
  }
  function iniciar(tipo) {
    cancelar()
    const controle = new AbortController()
    tarefa.current = controle
    ocupar(tipo)
    return controle.signal
  }
  async function buscar() {
    const signal = iniciar('locais')
    try {
      const lista = filtrarLocais(await carregarLocais(signal), respostas)
      if (signal.aborted) return
      listar(lista)
      escolher([])
      avancar(0)
      if (lista.length) mudarEtapa(1)
    } catch {
      if (!signal.aborted) avisar('Não foi possível carregar os lugares. Tente novamente.')
    } finally { if (!signal.aborted) ocupar('') }
  }
  function decidir(incluir) {
    const id = lugares[vistos].id
    const selecionados = escolhas.filter(valor => valor !== id)
    if (incluir) selecionados.push(id)
    escolher(selecionados)
    avancar(vistos + 1)
    if (vistos + 1 === lugares.length && selecionados.length) mudarEtapa(2)
  }
  function abrirPersonalizado() {
    cancelar(); setTipoRoteiro('personalizado'); setNomeRoteiro(''); mudarEtapa(0)
    responder({}); listar(null); avancar(0); escolher([]); definirOrigem(null); abrirMapa(false); mostrarRoteiro(null)
  }
  function voltarEscolha() {
    cancelar(); setTipoRoteiro(null); setNomeRoteiro(''); mudarEtapa(0)
  }
  async function selecionarPronto(ids, nome) {
    const signal = iniciar('locais')
    try {
      const lista = await carregarLocais(signal)
      if (signal.aborted) return
      const unicos = [...new Set(ids.map(String))]
      const encontrados = unicos.map(id => lista.find(l => String(l.id) === id)).filter(Boolean)
      if (!encontrados.length || encontrados.length !== unicos.length) {
        avisar('Nem todos os lugares desse roteiro estão disponíveis no catálogo atual. Escolha outro roteiro ou crie um personalizado.'); return
      }
      listar(encontrados); escolher(encontrados.map(l=>l.id)); avancar(encontrados.length)
      definirOrigem(null); abrirMapa(false); mostrarRoteiro(null); setNomeRoteiro(nome); setTipoRoteiro('pronto'); mudarEtapa(2)
    } catch {
      if (!signal.aborted) avisar('Não foi possível carregar o roteiro. Tente novamente.')
    } finally { if (!signal.aborted) ocupar('') }
  }
  function rever() {
    cancelar()
    avancar(0)
    mudarEtapa(1)
  }
  function alterarFiltro() {
    setTipoRoteiro('personalizado'); setNomeRoteiro('')
    cancelar()
    listar(null)
    mudarEtapa(0)
  }
  function localizar() {
    if (!navigator.geolocation) {
      avisar('A localização está indisponível. Escolha seu ponto no mapa.')
      abrirMapa(true)
      return
    }
    const signal = iniciar('gps')
    navigator.geolocation.getCurrentPosition(pos => {
      if (signal.aborted) return
      definirOrigem({ lat: pos.coords.latitude, lng: pos.coords.longitude, gps: true })
      abrirMapa(true)
      ocupar('')
    }, () => {
      if (signal.aborted) return
      ocupar('')
      abrirMapa(true)
      avisar('Não foi possível usar sua localização. Escolha um ponto no mapa.')
    }, { timeout: 10000, maximumAge: 60000 })
  }
  async function calcular() {
    const signal = iniciar('rota')
    try {
      const resultado = await gerarRoteiro(origem, lugares.filter(p => escolhas.includes(p.id)), signal)
      if (signal.aborted) return
      mostrarRoteiro({ ...resultado, id: crypto.randomUUID(),
        data: new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Recife' }).format(new Date()) })
      mudarEtapa(3)
    } catch {
      if (!signal.aborted) avisar('Não foi possível calcular o trajeto pelas ruas. Tente novamente ou altere a partida.')
    } finally { if (!signal.aborted) ocupar('') }
  }
  async function salvarPasseio() {
    const paradas = roteiro.paradas.map(({ local, inicio }) => ({
      uid: crypto.randomUUID(), ref: local.id, hora: hora(inicio % 1440),
      ...(!usaDemonstracao || !buscarItem(local.id) ? { nomeMapa: local.nome } : {}),
    }))
    setGravando(true)
    setSalvos(lista => [...lista, { id: roteiro.id, nome: nomeRoteiro || 'Passeio por Jaboatão', data: roteiro.data, paradas }])
    try { await aguardarGravacao() } catch (erro) { avisar(erro.message) }
    finally { setGravando(false) }
  }
  const temSim = Object.values(respostas).includes('sim')
  const pontoNaTela = origem && `${origem.lat.toFixed(4)}, ${origem.lng.toFixed(4)}`
  return <PaginaGuia pagina="mapa" titulo="Mapa interativo"
    descricao="Escolha os lugares que quer visitar e veja por onde começar o passeio.">
    <nav className="exp-mode exp-mode-cards" aria-label="Modo do mapa"><div className="exp-mode-heading"><strong>Como você quer explorar?</strong><span>Escolha um modo para começar seu passeio.</span></div><button type="button" aria-pressed={modo === "explorar"} onClick={() => { cancelar(); setModo("explorar") }}><span className="exp-mode-icon" aria-hidden="true">&#x1F5FA;</span><span className="exp-mode-copy"><strong>Explorar no mapa</strong><small>Veja todos os locais, horários e detalhes no mapa.</small></span><span className="exp-mode-arrow" aria-hidden="true">&#x2192;</span></button><button type="button" aria-pressed={modo === "roteiro"} onClick={() => setModo("roteiro")}><span className="exp-mode-icon" aria-hidden="true">&#x1F9ED;</span><span className="exp-mode-copy"><strong>Descobrir lugares e montar roteiro</strong><small>Deslize os cartões e monte seu passeio personalizado.</small></span><span className="exp-mode-arrow" aria-hidden="true">&#x2192;</span></button></nav>
    {modo === "explorar" ? <ExplorarMapa /> : !tipoRoteiro ? <EscolherRoteiro onCriar={abrirPersonalizado} onSelecionar={selecionarPronto} salvos={salvos} ocupado={ocupado} erro={erro}/> : (
    <>
    <div className="route-back"><button type="button" onClick={voltarEscolha}>← Escolher outro modo de roteiro</button>{nomeRoteiro&&<strong>{nomeRoteiro}</strong>}</div>
    <div className={etapa === 1 ? "map-layout map-layout--lugares" : "map-layout"}>
      <ol className="map-passos" aria-label="Etapas do passeio">{etapas.map((nome, i) =>
        <li key={nome} aria-current={etapa === i ? 'step' : undefined} className={i <= etapa ? 'atingido' : ''}>{nome}</li>)}</ol>
      <section className="map-painel">
        <h2 tabIndex="-1" ref={topo}>{['Filtro de interesses', 'Escolha seus lugares', 'Ponto de partida', 'Seu roteiro'][etapa]}</h2>
        {etapa === 0 && <>
          <p className="map-intro">Marque Sim para o que te interessa e Não para o que prefere deixar de fora. Você pode deixar categorias em branco.</p>
          <div className="map-categorias">{interesses.map(nome =>
            <fieldset key={nome} className="map-categoria" disabled={Boolean(ocupado)}>
              <legend className="map-sr">{nome}</legend><span aria-hidden="true">{nome}</span>
              <div>{['sim', 'nao'].map(valor => <label key={valor}>
                <input type="radio" name={nome} value={valor} checked={respostas[nome] === valor}
                  onChange={() => { responder({ ...respostas, [nome]: valor }); listar(null); avisar('') }} />
                <span>{valor === 'sim' ? 'Sim' : 'Não'}</span>
              </label>)}</div>
            </fieldset>)}</div>
          {lugares?.length === 0 && <p role="status">Nenhum lugar corresponde a esses interesses. Altere o filtro para buscar novamente.</p>}
          <div className="map-acoes"><button className="map-pri" disabled={!temSim || Boolean(ocupado)} onClick={buscar}>
            {ocupado ? 'Buscando…' : erro ? 'Tentar novamente' : 'Ver lugares'}</button>
            {Object.keys(respostas).length > 0 && <button className="map-link" disabled={Boolean(ocupado)}
              onClick={() => { responder({}); listar(null); avisar('') }}>Limpar respostas</button>}
            {!temSim && <small>Marque pelo menos um Sim.</small>}
          </div>
        </>}
        {etapa === 1 && <>
          <p className="map-intro" role="status">{vistos} de {lugares.length} vistos · {quantidade(escolhas.length)} na seleção</p>
          <div className="map-progress" role="progressbar" aria-label="Progresso da selecao" aria-valuemin={0} aria-valuemax={lugares.length} aria-valuenow={vistos}><span style={{width: (100 * vistos / lugares.length) + "%"}} /></div>
          {vistos < lugares.length
            ? <CartaoLugar key={lugares[vistos].id} local={lugares[vistos]} decidir={decidir}
                ilustrativa={usaDemonstracao && lugares[vistos].id !== 'a-3'} escolhido={escolhas.includes(lugares[vistos].id)} />
            : <p>Você percorreu todos os cartões. Reveja os lugares ou altere seus interesses.</p>}
          <div className="map-acoes map-navegar">
            {escolhas.length > 0 && <button className="map-pri" onClick={() => mudarEtapa(2)}>Montar roteiro</button>}
            {vistos === lugares.length && <button className="map-sec" onClick={rever}>Rever lugares</button>}
            <button className="map-link" onClick={alterarFiltro}>Alterar interesses</button>
          </div>
        </>}
        {etapa === 2 && <>
          <p className="map-intro">{quantidade(escolhas.length)} na seleção · Percurso de carro · Saída agora, no horário de Jaboatão.</p>
          <div className="map-acoes">
            <button className="map-sec" onClick={localizar} disabled={Boolean(ocupado)}>{ocupado === 'gps' ? 'Localizando…' : 'Usar minha localização'}</button>
            <button className="map-sec" onClick={() => { cancelar(); abrirMapa(true) }}>Escolher no mapa</button>
          </div>
          {manual && <>
            <p className="map-ajuda">Toque no ponto de partida ou mova o mapa com as setas e use o centro.</p>
            <Suspense fallback={<p>Carregando mapa…</p>}><MapaFolha origem={origem} selecionar={p => {
              cancelar(); definirOrigem(p)
            }} /></Suspense>
          </>}
          {origem && <p className="map-ajuda">Partida selecionada · {pontoNaTela}</p>}
          <p className="map-ajuda">Ao gerar o roteiro, a origem e as paradas serão enviadas ao serviço de rotas OSRM.</p>
          <div className="map-acoes"><button className="map-pri" disabled={!origem || Boolean(ocupado)} onClick={calcular}>
            {ocupado === 'rota' ? 'Calculando roteiro…' : erro && origem ? 'Tentar calcular roteiro' : 'Gerar roteiro'}</button>
            <button className="map-link" onClick={rever}>Rever escolhas</button></div>
        </>}
        {etapa === 3 && <>
          <p className="map-intro">{dias[roteiro.relogio.dia]} · Saída às {hora(roteiro.relogio.minuto)} · De carro</p>
          {roteiro.paradas.length > 0 ? <>
            <Suspense fallback={<p>Carregando trajeto…</p>}><MapaFolha key="resultado" origem={origem} resultado={roteiro} /></Suspense>
            <p className="map-ajuda">Tempos estimados de deslocamento e visita. Funcionamento na hora da consulta.</p>
            <ol className="map-paradas">{roteiro.paradas.map((p, i) => <li key={p.local.id}>
              <span className="map-numero" aria-hidden="true">{i + 1}</span>
              <div><DetalheParada parada={p} relogio={roteiro.relogio} /></div>
            </li>)}</ol>
            <button className="map-pri" disabled={gravando || salvos.some(r => r.id === roteiro.id)} onClick={salvarPasseio}>
              {gravando ? 'Salvando…' : salvos.some(r => r.id === roteiro.id) ? 'Salvo em Meus roteiros' : 'Salvar em Meus roteiros'}
            </button>
          </> : <p role="status">Nenhuma visita coube no passeio de hoje.</p>}
          {roteiro.fora.length > 0 && <section className="map-fora"><h2>Fora do trajeto</h2>
            {roteiro.fora.map(({ local, motivo }) => <div key={local.id}>
              <h3>{local.nome}</h3><p>{motivo}</p>
              {motivo !== situacao(local.horarios, roteiro.relogio) && <p>{situacao(local.horarios, roteiro.relogio)}</p>}
              <Semana local={local} /></div>)}</section>}
          <div className="map-acoes"><button className="map-sec" onClick={() => mudarEtapa(2)}>Alterar partida</button>
            <button className="map-link" onClick={rever}>Rever escolhas</button>
            <button className="map-link" onClick={alterarFiltro}>Alterar interesses</button></div>
        </>}
        {erro && <p className="map-erro" role="alert">{erro}</p>}
        {usaDemonstracao && <p className="map-demo">Catálogo de demonstração · Locais e horários de exemplo.</p>}
      </section>
    </div>
    </>
    )}
  </PaginaGuia>
}
