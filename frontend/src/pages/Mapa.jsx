import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Corrige ícones padrão do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const atrativos = [
  {
    id: 1,
    nome: 'Praia de Piedade',
    categoria: 'Praia',
    descricao: 'Águas calmas e boa infraestrutura. Uma das praias mais procuradas do litoral sul de Pernambuco.',
    lat: -8.1823,
    lng: -34.9005,
  },
  {
    id: 2,
    nome: 'Praia de Candeias',
    categoria: 'Praia',
    descricao: 'Praia urbana com calçadão e quiosques, agitada durante todo o ano.',
    lat: -8.1750,
    lng: -34.9050,
  },
  {
    id: 3,
    nome: 'Parque Histórico Nacional dos Guararapes',
    categoria: 'Parque histórico',
    descricao: 'Palco das Batalhas dos Guararapes (1648–1649), marco da formação do Brasil.',
    lat: -8.1669,
    lng: -34.9286,
  },
  {
    id: 4,
    nome: 'Igreja de Nossa Senhora do Pilar',
    categoria: 'Patrimônio histórico',
    descricao: 'Igreja do século XVII, símbolo da história colonial de Jaboatão dos Guararapes.',
    lat: -8.1800,
    lng: -34.9400,
  },
  {
    id: 5,
    nome: 'Praia de Barra de Jangada',
    categoria: 'Praia',
    descricao: 'Praia tranquila na foz do Rio Jaboatão, popular entre famílias e pescadores.',
    lat: -8.1900,
    lng: -34.8980,
  },
  {
    id: 6,
    nome: 'Morro da Conceição',
    categoria: 'Ponto cultural',
    descricao: 'Elevação com vista panorâmica e forte presença religiosa e cultural.',
    lat: -8.1750,
    lng: -34.9200,
  },
]

export default function Mapa() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold text-green-700 mb-2">Mapa de atrativos</h1>
      <p className="text-gray-500 text-sm mb-4">
        Clique em um marcador para ver informações sobre o atrativo.
      </p>

      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm rounded-lg px-4 py-3 mb-6">
        ⚠️ Dados demonstrativos — MVP acadêmico do projeto Jaboatão 360.
      </div>

      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200" style={{ height: '500px' }}>
        <MapContainer
          center={[-8.1800, -34.9200]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {atrativos.map((a) => (
            <Marker key={a.id} position={[a.lat, a.lng]}>
              <Popup>
                <div className="text-sm">
                  <span className="text-xs font-semibold text-green-700 uppercase">{a.categoria}</span>
                  <p className="font-bold text-gray-800 mt-1 mb-1">{a.nome}</p>
                  <p className="text-gray-600">{a.descricao}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </main>
  )
}