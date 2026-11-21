import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet'
import { divIcon, DomEvent, latLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import DetalheParada from './DetalheParada'

const centro = [-8.178, -34.921]
const coordenadas = local => [local.lat, local.lng]
function icone(numero) {
  return divIcon({ className: 'map-pino', html: numero ? String(numero) : '●', iconSize: [28, 28], iconAnchor: [14, 14] })
}
function EscolherPonto({ origem, selecionar }) {
  const botao = useRef(null)
  useEffect(() => { DomEvent.disableClickPropagation(botao.current) }, [])
  const mapa = useMapEvents({ click({ latlng }) { selecionar({ lat: latlng.lat, lng: latlng.lng }) } })
  useEffect(() => {
    if (origem?.gps) mapa.setView(coordenadas(origem), 14)
  }, [origem, mapa])
  return <button ref={botao} className="map-centro" type="button" onClick={event => {
    event.stopPropagation()
    const { lat, lng } = mapa.getCenter()
    selecionar({ lat, lng })
  }}>Usar o centro do mapa</button>
}
function Enquadrar({ resultado }) {
  const mapa = useMap()
  useEffect(() => {
    const limites = latLngBounds([coordenadas(resultado.origem),
      ...resultado.paradas.map(p => coordenadas(p.local)), ...resultado.tracados.flat()])
    mapa.fitBounds(limites, { padding: [30, 30], maxZoom: 15 })
  }, [mapa, resultado])
  return null
}
export default function MapaFolha({ origem, selecionar, resultado }) {
  return <MapContainer center={origem ? coordenadas(origem) : centro} zoom={13}
    scrollWheelZoom={false} className="map-folha" aria-label="Mapa de Jaboatão dos Guararapes">
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {origem && <Marker position={coordenadas(origem)} title="Ponto de partida" icon={icone()}>
      <Popup>Ponto de partida</Popup>
    </Marker>}
    {selecionar && <EscolherPonto origem={origem} selecionar={selecionar} />}
    {resultado && <>
      <Enquadrar resultado={resultado} />
      {resultado.tracados.map((linha, i) => <Polyline key={resultado.paradas[i].local.id} positions={linha}
        pathOptions={{ color: '#086c67', weight: 5, opacity: 0.9 }} />)}
      {resultado.paradas.map((p, i) => <Marker key={p.local.id} position={coordenadas(p.local)}
        icon={icone(i + 1)} title={`${i + 1}. ${p.local.nome}`}>
        <Popup><DetalheParada parada={p} relogio={resultado.relogio} /></Popup>
      </Marker>)}
    </>}
  </MapContainer>
}
