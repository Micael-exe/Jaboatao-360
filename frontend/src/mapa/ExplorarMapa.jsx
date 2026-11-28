import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet'
import { divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { carregarLocais, demonstracao, usaDemonstracao } from './catalogo'
import { catalogo } from '../data/dados'
import { agoraEmJaboatao, dias, funcionamento, situacao } from './horarios'
import { CENTRO, CATEGORIAS, ICONES, montarCatalogo, filtrar, temCoordenadas } from './explorar-dados'
import { consultarRota } from './rota-explorar'
import './ExplorarMapa.css'

const icones=Object.fromEntries(Object.entries(ICONES).map(([cat,emoji])=>[cat,divIcon({className:'exp-marker exp-marker-'+cat,html:`<span aria-hidden="true">${emoji}</span>`,iconSize:[36,36],iconAnchor:[18,18],popupAnchor:[0,-20]})]))
const gpsIcon=divIcon({className:'exp-gps-marker',html:'<span></span>',iconSize:[22,22],iconAnchor:[11,11]})
const pos=l=>[l.lat,l.lng]
const km=d=>d==null?'':d<1?`${Math.round(d*1000)} m`:`${d.toLocaleString('pt-BR',{maximumFractionDigits:1})} km`
function Controles({pontos,alvo,ajuste,rota,escolhendo,onOrigem}) {
  const mapa=useMap()
  useMapEvents({click(e){if(escolhendo)onOrigem({lat:e.latlng.lat,lng:e.latlng.lng})}})
  useEffect(()=>{if(rota)mapa.fitBounds(rota.linha,{padding:[45,45],maxZoom:15})},[mapa,rota])
  const iniciais=useRef(pontos)
  useEffect(()=>{iniciais.current=pontos},[pontos])
  useEffect(()=>{
    const lista=iniciais.current
    if(lista.length) mapa.fitBounds(lista.map(pos),{padding:[45,45],maxZoom:15})
  },[mapa,ajuste])
  useEffect(()=>{if(alvo) mapa.flyTo(pos(alvo), Math.max(mapa.getZoom(),15),{duration:.45})},[mapa,alvo])
  return <button type="button" className="exp-center" onClick={()=>{if(pontos.length)mapa.fitBounds(pontos.map(pos),{padding:[45,45],maxZoom:15})}}>Enquadrar todos os pontos</button>
}
function Detalhes({local:l,fechar,demonstrativo,origem,rota,carregando,onRota,onManual,onGps,onLimpar,erro}) {
  const [fotoFalhou,setFotoFalhou]=useState(false)
  const [agora,setAgora]=useState(()=>new Date())
  useEffect(()=>{const t=setInterval(()=>setAgora(new Date()),60000);return()=>clearInterval(t)},[])
  const status=l.horarios?situacao(l.horarios,agoraEmJaboatao(agora)):'Horário a confirmar'
  const cor=status.startsWith('Aberto')?'aberto':status.startsWith('Fechado')?'fechado':''
  return <article className="exp-detail exp-detail-v2" aria-label="Detalhes do local">
    <button className="exp-close" onClick={fechar} aria-label="Fechar detalhes">×</button>
    {l.foto&&!fotoFalhou&&<><img src={l.foto} alt={demonstrativo?'Foto do catálogo de demonstração':l.nome} onError={()=>setFotoFalhou(true)} loading="lazy"/><small className="exp-photo-credit">{demonstrativo?'Imagem do catálogo demonstrativo':'Imagem do catálogo do planejador'}</small></>}
    <span className="exp-tag">{ICONES[l.cat]} {CATEGORIAS[l.cat]}</span><h3>{l.nome}</h3>
    {l.distancia!=null&&<strong className="exp-distance">{km(l.distancia)} em linha reta</strong>}
    {l.descricao&&<p>{l.descricao}</p>}
    {l.bairro&&<p>📍 {l.bairro}</p>}
    {l.tipo&&<p>{l.tipo}{l.preco&&` · Faixa de preço: ${l.preco}`}</p>}
    {l.proximoA&&<p>Próximo a: {l.proximoA}</p>}
    <div className="exp-hours"><h4>Horário de funcionamento</h4><strong className={'exp-status '+cor}>{status}</strong>
      {l.horarios?<details className="map-semana" open><summary>Horários da semana</summary><dl>{[1,2,3,4,5,6,0].map(dia=><div key={dia}><dt>{dias[dia]}</dt><dd>{funcionamento(l.horarios,dia)}</dd></div>)}</dl></details>:<p>{l.horario?`Catálogo de comércio: ${l.horario} (dias não informados).`:'O catálogo não informa os horários.'}</p>}
      {l.duracaoMin>0&&<p>Duração sugerida da visita: <strong>{l.duracaoMin} min</strong></p>}
      <small>{demonstrativo?'Horários ilustrativos do projeto. Não representam funcionamento real.':'Horários do catálogo do planejador; confirme antes de visitar.'}</small>
    </div>
    {temCoordenadas(l)&&<div className="exp-route-panel"><h4>Como chegar</h4>{origem?<><button type="button" className="exp-route-primary" disabled={carregando} onClick={()=>onRota(l)}>{carregando?'Calculando rota…':'🚗 Traçar rota de carro'}</button><button type="button" className="exp-route-secondary" onClick={onManual}>Alterar ponto de partida</button></>:<><p>Escolha de onde vai sair.</p><button type="button" className="exp-route-primary" onClick={onGps}>◎ Usar minha localização</button><button type="button" className="exp-route-secondary" onClick={onManual}>Marcar partida no mapa</button></>}{rota&&<div className="exp-route-result"><strong>{km(rota.distancia)} · {rota.minutos} min de carro</strong><small>Estimativa pelas ruas, sem trânsito em tempo real.</small><button type="button" className="exp-route-secondary" onClick={onLimpar}>Remover rota</button></div>}{erro&&<p role="alert" className="exp-notice">{erro}</p>}</div>}
    {!temCoordenadas(l)&&<p className="exp-notice">Sem localização cadastrada. Disponível na lista, sem marcador no mapa.</p>}
  </article>
}
export default function ExplorarMapa(){
  const [dados,setDados]=useState(()=>montarCatalogo(demonstracao,catalogo)),[demo,setDemo]=useState(true),[aviso,setAviso]=useState('')
  const [origem,setOrigem]=useState(null),[alvo,setAlvo]=useState(null),[ajuste,setAjuste]=useState(0),[cat,setCat]=useState('todos'),[busca,setBusca]=useState(''),[id,setId]=useState(null),[gps,setGps]=useState(false),[erro,setErro]=useState('')
  const [rota,setRota]=useState(null),[calculando,setCalculando]=useState(false),[erroRota,setErroRota]=useState(''),[escolhendo,setEscolhendo]=useState(false)
  const pedidoRota=useRef(null)
  function limparRota(){pedidoRota.current?.abort();pedidoRota.current=null;setRota(null);setCalculando(false);setErroRota('')}
  function marcarOrigem(){limparRota();setEscolhendo(true)}
  function definirOrigem(p){setOrigem(p);setEscolhendo(false);limparRota()}
  async function tracar(l){
    if(!origem||!temCoordenadas(l))return
    limparRota();const c=new AbortController();pedidoRota.current=c;setCalculando(true)
    try{const resultado=await consultarRota(origem,l,c.signal);if(!c.signal.aborted)setRota(resultado)}
    catch{if(!c.signal.aborted)setErroRota('Não foi possível calcular a rota pelas ruas. Tente novamente ou altere a partida.')}
    finally{if(pedidoRota.current===c){pedidoRota.current=null;setCalculando(false)}}
  }
  useEffect(()=>{return()=>pedidoRota.current?.abort()},[])
  const ativo=useRef(false)
  useEffect(()=>{ativo.current=true;return()=>{ativo.current=false}},[])
  useEffect(()=>{
    if(usaDemonstracao)return
    const c=new AbortController()
    carregarLocais(c.signal).then(l=>{if(!c.signal.aborted){setDados(montarCatalogo(l,catalogo));setDemo(false);setAjuste(n=>n+1)}}).catch(()=>{if(!c.signal.aborted)setAviso('Catálogo externo indisponível. Exibindo os dados demonstrativos do projeto.')})
    return()=>c.abort()
  },[])
  const visiveis=useMemo(()=>filtrar(dados,{origem,cat,busca}),[dados,origem,cat,busca])
  const pontos=useMemo(()=>visiveis.filter(temCoordenadas),[visiveis])
  const semLocal=visiveis.filter(l=>!temCoordenadas(l))
  const selecionado=visiveis.find(l=>l.id===id)
  function selecionar(l,voar=true){if(id!==l.id){limparRota();setEscolhendo(false)}setId(l.id);if(voar&&temCoordenadas(l))setAlvo(l)}
  function limpar(){limparRota();setEscolhendo(false);setCat('todos');setBusca('');setId(null);setAlvo(null);setAjuste(n=>n+1)}
  function localizar(){
    if(!navigator.geolocation){setErro('Localização indisponível neste navegador.');return}
    setGps(true);setErro('')
    navigator.geolocation.getCurrentPosition(p=>{if(!ativo.current)return;setGps(false);definirOrigem({lat:p.coords.latitude,lng:p.coords.longitude,gps:true})},()=>{if(!ativo.current)return;setGps(false);setErro('Não foi possível acessar sua localização. Todos os locais continuam disponíveis.')},{timeout:12000,maximumAge:30000,enableHighAccuracy:false})
  }
  function lista(locais){return locais.map(l=><button key={l.id} className={'exp-place'+(id===l.id?' selected':'')} onClick={()=>selecionar(l)}><span className={'exp-place-icon '+l.cat}>{ICONES[l.cat]}</span><span><strong>{l.nome}</strong><small>{CATEGORIAS[l.cat]}{l.bairro&&` · ${l.bairro}`}</small></span><span className="exp-distance">{km(l.distancia)||'›'}</span></button>)}
  return <section className="exp-page" aria-label="Explorar pontos de interesse">
    <div className="exp-title"><div><h2>Explore Jaboatão</h2><p>Todos os lugares do catálogo em um só mapa. Escolha um ponto para ver seus detalhes.</p></div><button type="button" className="exp-locate" onClick={localizar} disabled={gps}>{gps?'Localizando…':origem?'◎ Atualizar minha localização':'◎ Usar minha localização'}</button></div>
    <div className="exp-toolbar"><label className="exp-search">Buscar um lugar<input type="search" placeholder="Ex.: praia, museu, restaurante" value={busca} onChange={e=>{setBusca(e.target.value);setId(null);limparRota();setEscolhendo(false)}}/></label><button className="exp-reset" onClick={limpar}>Ver todos os locais</button>{origem&&<button className="exp-reset" onClick={()=>{setOrigem(null);limparRota();setEscolhendo(false)}}>Remover localização</button>}</div>
    <div className="exp-cats" aria-label="Categorias">{Object.entries(CATEGORIAS).filter(([key])=>key==='todos'||dados.some(l=>l.cats.includes(key))).map(([key,label])=><button type="button" key={key} aria-pressed={cat===key} onClick={()=>{setCat(key);setId(null);setAlvo(null);limparRota();setEscolhendo(false);setAjuste(n=>n+1)}}>{ICONES[key]} {label}</button>)}</div>
    {erro&&<p role="alert" className="exp-notice">{erro}</p>}{aviso&&<p role="status" className="exp-notice">{aviso}</p>}
    <p className="exp-source">{demo?'Catálogo demonstrativo do planejador e do comércio local. Horários, fotos e coordenadas de exemplo.':'Catálogo do planejador e do comércio local. Confirme as informações antes de visitar.'} Sem filtro de raio.</p>
    {escolhendo&&<p role="status" className="exp-notice">Clique em um ponto livre do mapa para escolher a partida. <button type="button" onClick={()=>setEscolhendo(false)}>Cancelar</button></p>}
    <div className="exp-grid">
      <div className="exp-map-wrap"><MapContainer center={CENTRO} zoom={12} minZoom={9} maxZoom={19} className="exp-map" scrollWheelZoom={true} aria-label="Mapa interativo de Jaboatão">
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'/>
        <Controles pontos={pontos} alvo={alvo} ajuste={ajuste} rota={rota} escolhendo={escolhendo} onOrigem={definirOrigem}/>
        {rota&&<><Polyline positions={rota.linha} pathOptions={{color:"#fff",weight:9,opacity:.9}}/><Polyline positions={rota.linha} pathOptions={{color:"#087f70",weight:5,opacity:1}}/></>}
        {origem&&<Marker position={pos(origem)} icon={gpsIcon}><Popup>{origem.gps?"Sua localização":"Ponto de partida escolhido"}</Popup></Marker>}
        {pontos.map(l=><Marker key={l.id} position={pos(l)} title={l.nome} icon={icones[l.cat]} eventHandlers={{click:()=>selecionar(l,false)}}><Popup><strong>{l.nome}</strong><br/>{CATEGORIAS[l.cat]}{l.distancia!=null&&` · ${km(l.distancia)}`}</Popup></Marker>)}
      </MapContainer><div className="exp-map-caption">{origem?'Distâncias em linha reta do ponto de partida. Nenhum ponto é excluído pela distância.':'Ative o GPS para ver distâncias sem ocultar nenhum local.'} {pontos.length} pontos no mapa.</div></div>
      <aside className="exp-side">
        {selecionado&&<Detalhes key={selecionado.id} local={selecionado} fechar={()=>{setId(null);limparRota();setEscolhendo(false)}} demonstrativo={demo||!selecionado.noRoteiro} origem={origem} rota={rota} carregando={calculando} onRota={tracar} onManual={marcarOrigem} onGps={localizar} onLimpar={limparRota} erro={erroRota}/>}
        <h3>Locais encontrados <span>{visiveis.length}</span></h3>{visiveis.length===0&&<p>Nenhum local corresponde ao filtro. Altere a busca ou a categoria.</p>}
        <div className="exp-list">{lista(pontos)}{semLocal.length>0&&<><h4 className="exp-list-heading">Sem localização cadastrada ({semLocal.length})</h4>{lista(semLocal)}</>}</div>
      </aside>
    </div>
  </section>
}
