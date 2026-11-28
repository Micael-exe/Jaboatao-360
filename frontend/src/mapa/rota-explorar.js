const servidor = (import.meta.env?.VITE_MAPA_OSRM_URL || 'https://router.project-osrm.org').replace(/\/+$/, '')
export async function consultarRota(origem, destino, signal, consultar = fetch) {
  const coords = [origem, destino].map(p => {
    if (!Number.isFinite(p?.lat) || !Number.isFinite(p?.lng) || Math.abs(p.lat)>90 || Math.abs(p.lng)>180) throw new Error('Coordenadas inválidas.')
    return `${p.lng.toFixed(6)},${p.lat.toFixed(6)}`
  }).join(';')
  const r = await consultar(`${servidor}/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`, {signal: AbortSignal.any([signal, AbortSignal.timeout(20000)])})
  if (!r.ok) throw new Error('Não foi possível consultar o serviço de rotas.')
  const json = await r.json()
  const rota = json.routes?.[0]
  if (json.code !== 'Ok' || !rota || !Number.isFinite(rota.distance) || rota.distance<0 || !Number.isFinite(rota.duration) || rota.duration<0 || !Array.isArray(rota.geometry?.coordinates) || rota.geometry.coordinates.length<2) throw new Error('Nenhuma rota de carro encontrada.')
  const linha = rota.geometry.coordinates.map(p=>{
    if (!Array.isArray(p) || !Number.isFinite(p[0]) || !Number.isFinite(p[1]) || Math.abs(p[0])>180 || Math.abs(p[1])>90) throw new Error('Trajeto inválido.')
    return [p[1],p[0]]
  })
  return {linha, distancia:rota.distance/1000, minutos:Math.ceil(rota.duration/60)}
}
