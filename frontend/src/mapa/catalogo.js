import { buscarItem } from '../data/dados'
import pilar from '../assets/jaboatao/pilar.webp'

export const interesses = ['Praias', 'Shoppings', 'Museus', 'Artesanato', 'Restaurantes', 'Bares', 'Outros']
const normalizar = texto => texto.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const categorias = new Map([
  ['praia', 'Praias'], ['shopping', 'Shoppings'], ['museu', 'Museus'],
  ['restaurante', 'Restaurantes'], ['bar', 'Bares'],
  ...interesses.map(nome => [normalizar(nome), nome]),
])

export function filtrarLocais(locais, respostas) {
  return locais.filter(local => {
    const escolhas = local.tags.map(tag => respostas[categorias.get(normalizar(tag)) ?? 'Outros'])
    return escolhas.includes('sim') && !escolhas.includes('nao')
  })
}

const semana = (abre, fecha) => Array.from({ length: 7 }, () => [[abre, fecha]])
const foto = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=960&q=80`
const fotosPraia = ['photo-1507525428034-b723cf961d3e', 'photo-1519046904884-53103b34b206', 'photo-1471922694854-ff1b63b20054']
const museu = semana('10:00', '14:00')
museu[0] = []
museu[6] = [['12:00', '15:00']]

// Catálogo de demonstração. Coordenadas, horários, duração e fotos ilustrativas
// servem para experimentar o fluxo até conectar a API da equipe.
function exemplo(id, nome, tags, lat, lng, imagem, horarios, duracaoMin = 30) {
  return { id, nome: nome ?? buscarItem(id).nome, tags, lat, lng, foto: imagem, horarios, duracaoMin }
}
export const demonstracao = [
  exemplo('a-1', null, ['Praia'], -8.1782, -34.9168, foto(fotosPraia[0]), semana('00:00', '24:00'), 40),
  exemplo('a-2', null, ['Praia'], -8.1934, -34.9193, foto(fotosPraia[1]), semana('00:00', '24:00'), 40),
  exemplo('a-5', null, ['Praia'], -8.2221, -34.9234, foto(fotosPraia[2]), semana('00:00', '24:00'), 40),
  exemplo('a-3', null, ['Patrimônio histórico'], -8.1800, -34.9400, pilar, semana('08:00', '17:00')),
  exemplo('a-4', null, ['Parque'], -8.1669, -34.9286, foto('photo-1441974231531-c6227db76b6e'), semana('08:00', '17:00'), 45),
  exemplo('a-6', null, ['Ponto cultural'], -8.1750, -34.9200, foto('photo-1472396961693-142e6e269027'), semana('08:00', '18:00')),
  exemplo('demo-museu', 'Museu de História Local', ['Museu'], -8.162, -34.923, foto('photo-1577083552431-6e5fd01aa342'), museu),
  exemplo('c-3', null, ['Artesanato'], -8.173, -34.931, foto('photo-1493106641515-6b5631de4bb9'), semana('09:00', '17:00')),
  exemplo('c-1', null, ['Restaurante'], -8.1798, -34.9172, foto('photo-1517248135467-4c7edcad34c4'), semana('10:00', '18:00'), 60),
  exemplo('demo-shopping', 'Shopping do passeio', ['Shopping'], -8.1655, -34.9157, foto('photo-1519567241046-7f570eee3ce6'), semana('10:00', '22:00'), 45),
  exemplo('demo-bar', 'Bar da Orla', ['Bar'], -8.1885, -34.918, foto('photo-1514933651103-005eec06c04b'), semana('16:00', '23:30'), 45),
]

export const usaDemonstracao = !import.meta.env.VITE_MAPA_LOCAIS_URL

export function lerCatalogo(dados, base) {
  const lista = Array.isArray(dados) ? dados : dados?.locais
  if (!Array.isArray(lista)) throw new Error('A API enviou um catálogo inválido.')
  const unicos = new Map()
  for (const local of lista) {
    if (!local || !['string', 'number'].includes(typeof local.id) || !String(local.id).trim() ||
        typeof local.nome !== 'string' || !local.nome.trim() ||
        !Array.isArray(local.tags) || !local.tags.every(tag => typeof tag === 'string' && tag.trim()) ||
        !Number.isFinite(local.lat) || Math.abs(local.lat) > 90 ||
        !Number.isFinite(local.lng) || Math.abs(local.lng) > 180) {
      throw new Error('Confira os campos de identificação, tags e coordenadas na API de locais.')
    }
    const id = String(local.id)
    const existente = unicos.get(id)
    if (existente) {
      existente.tags = [...new Set([...existente.tags, ...local.tags])]
      continue
    }
    let imagem = null
    if (typeof local.foto === 'string' && local.foto.trim()) {
      if (URL.canParse(local.foto, base)) {
        const url = new URL(local.foto, base)
        if (['https:', 'http:'].includes(url.protocol)) imagem = url.href
      }
    }
    unicos.set(id, { ...local, id, foto: imagem,
      duracaoMin: Number.isFinite(local.duracaoMin) && local.duracaoMin > 0 ? Math.ceil(local.duracaoMin) : 30 })
  }
  return [...unicos.values()]
}

export async function carregarLocais(signal) {
  if (usaDemonstracao) return demonstracao
  const resposta = await fetch(import.meta.env.VITE_MAPA_LOCAIS_URL, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
  })
  if (!resposta.ok) throw new Error('Não foi possível carregar os lugares.')
  return lerCatalogo(await resposta.json(), resposta.url)
}
