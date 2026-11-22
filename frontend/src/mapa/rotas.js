import { agoraEmJaboatao } from './horarios'
import { planejar, preparar } from './planejar'

const servidor = (import.meta.env.VITE_MAPA_OSRM_URL || 'https://router.project-osrm.org').replace(/\/+$/, '')
const mensagem = 'O serviço de rotas está indisponível. Tente novamente com os mesmos lugares.'
const indices = n => Array.from({ length: n }, (_, i) => i)
function emMinutos(segundos) {
  return Number.isFinite(segundos) && segundos >= 0 ? Math.ceil(segundos / 60) : null
}
async function consultar(servico, pontos, parametros, signal) {
  const coords = pontos.map(p => `${p.lng.toFixed(6)},${p.lat.toFixed(6)}`).join(';')
  const url = `${servidor}/${servico}/v1/driving/${coords}?${new URLSearchParams(parametros)}`
  const resposta = await fetch(url, { signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]) })
  const json = await resposta.json()
  if (json.code === 'NoRoute' && servico === 'route') return null
  if (!resposta.ok || json.code !== 'Ok') throw new Error(mensagem)
  return json
}
async function tabela(pontos, signal) {
  const ids = indices(pontos.length)
  const matriz = ids.map(() => Array(pontos.length).fill(null))
  // Blocos também atendem catálogos maiores que o limite de coordenadas do OSRM.
  const tamanho = pontos.length <= 80 ? pontos.length : 40
  for (let a = 0; a < pontos.length; a += tamanho) {
    for (let b = 0; b < pontos.length; b += tamanho) {
      const origens = ids.slice(a, a + tamanho), destinos = ids.slice(b, b + tamanho)
      const bloco = [...new Set([...origens, ...destinos])]
      const resultado = await consultar('table', bloco.map(i => pontos[i]), {
        sources: origens.map(i => bloco.indexOf(i)).join(';'), destinations: destinos.map(i => bloco.indexOf(i)).join(';'),
      }, signal)
      if (!Array.isArray(resultado.durations) || resultado.durations.length !== origens.length) throw new Error(mensagem)
      origens.forEach((i, linha) => {
        const valores = resultado.durations[linha]
        if (!Array.isArray(valores) || valores.length !== destinos.length) throw new Error(mensagem)
        destinos.forEach((j, coluna) => { matriz[i][j] = emMinutos(valores[coluna]) })
      })
    }
  }
  return matriz
}

export async function gerarRoteiro(origem, escolhidos, signal, data = new Date()) {
  const relogio = agoraEmJaboatao(data)
  relogio.partida = relogio.minuto + Number(relogio.segundos > 0)
  const { aptos, fora } = preparar(escolhidos, relogio)
  const resultado = { origem, relogio, fora, paradas: [], tracados: [] }
  if (!aptos.length) return resultado
  const pontos = [origem, ...aptos]
  const matriz = await tabela(pontos, signal)
  const trechos = new Map()
  // Valida cada trecho pelas ruas. Se o tempo da geometria mudar o minuto de
  // chegada, planeja de novo. Cada trecho é consultado no máximo uma vez.
  for (;;) {
    const paradas = planejar(aptos, matriz, relogio.partida)
    let anterior = 0, recalcular = false
    const tracados = []
    for (const parada of paradas) {
      const destino = parada.indice, chave = `${anterior}-${destino}`
      if (!trechos.has(chave)) {
        const resposta = await consultar('route', [pontos[anterior], pontos[destino]],
          { overview: 'full', geometries: 'geojson', steps: 'false' }, signal)
        const rota = resposta?.routes?.[0]
        const minutos = rota ? emMinutos(rota.duration) : null
        if (resposta && (!rota || minutos === null || !Array.isArray(rota.geometry?.coordinates) ||
            rota.geometry.coordinates.length < 2)) throw new Error(mensagem)
        trechos.set(chave, rota?.geometry.coordinates.map(([lng, lat]) => [lat, lng]) ?? null)
        if (matriz[anterior][destino] !== minutos) {
          matriz[anterior][destino] = minutos
          recalcular = true
          break
        }
      }
      tracados.push(trechos.get(chave))
      anterior = destino
    }
    if (recalcular) continue
    const incluidos = new Set(paradas.map(p => p.local.id))
    aptos.forEach((local, i) => {
      if (!incluidos.has(local.id)) fora.push({ local, motivo: matriz[0][i + 1] === null
        ? 'Sem trajeto de carro a partir da origem.' : 'A visita não coube nos horários deste roteiro.' })
    })
    return { ...resultado, paradas, tracados }
  }
}
