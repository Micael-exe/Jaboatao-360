// Catálogo compartilhado: os horários originais do planejador são preservados.
export const CENTRO = [-8.165, -34.985]
export const CATEGORIAS = { todos:'Todos', praia:'Praias', comercio:'Comércio', gastronomia:'Gastronomia', cultura:'Cultura e história', natureza:'Parques', museu:'Museus', shopping:'Shoppings', artesanato:'Artesanato', bar:'Bares', aventura:'Aventura', hospedagem:'Hospedagem', outros:'Outros' }
export const ICONES = { todos:'◉', praia:'🏖️', comercio:'🛍️', gastronomia:'🍴', cultura:'🏛️', natureza:'🌳', museu:'🏺', shopping:'🛒', artesanato:'🧶', bar:'🍹', aventura:'⛵', hospedagem:'🛏️', outros:'📍' }
const normalizar = v => String(v ?? '').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase()
export function temCoordenadas(l) {
  return Number.isFinite(l.lat) && Number.isFinite(l.lng) && Math.abs(l.lat)<=90 && Math.abs(l.lng)<=180
}
export function categoriasDoLocal(l) {
  const tags = normalizar([l.categoria, ...(l.tags || [])].join(' '))
  const cats = []
  if (tags.includes('praia')) cats.push('praia')
  if (/restaurante|gastronomia|bar/.test(tags)) cats.push('gastronomia')
  if (/histor|cultur|museu/.test(tags)) cats.push('cultura')
  if (/parque|natureza/.test(tags)) cats.push('natureza')
  if (tags.includes('museu')) cats.push('museu')
  if (tags.includes('shopping')) cats.push('shopping')
  if (tags.includes('artesanato')) cats.push('artesanato')
  if (/\bbar(es)?\b/.test(tags)) cats.push('bar')
  if (tags.includes('aventura')) cats.push('aventura')
  if (tags.includes('hospedagem')) cats.push('hospedagem')
  if (l.origem==='Comércio' || cats.some(c=>['gastronomia','shopping','artesanato','bar','hospedagem'].includes(c))) cats.push('comercio')
  return cats.length ? cats : ['outros']
}
export function montarCatalogo(roteiro, catalogo) {
  const porId = new Map(catalogo.map(l=>[String(l.id),l]))
  const mapa = new Map(roteiro.map(r=>{
    const id=String(r.id), d=porId.get(id) || {}
    return [id,{...d,...r,id,noRoteiro:true}]
  }))
  for (const l of catalogo) {
    const id=String(l.id)
    if (!mapa.has(id)) mapa.set(id,{...l,id,noRoteiro:false})
  }
  return [...mapa.values()].map(l=>{
    const cats=categoriasDoLocal(l)
    // A categoria específica determina o marcador; Comércio continua sendo um filtro abrangente.
    const cat=['praia','bar','museu','shopping','artesanato','natureza','gastronomia','cultura','aventura','hospedagem','comercio','outros'].find(c=>cats.includes(c)) || 'outros'
    return {...l,cats,cat}
  })
}
export function distanciaKm(a,b) {
  const rad = n=>n*Math.PI/180
  const h=Math.sin(rad(b.lat-a.lat)/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lng-a.lng)/2)**2
  return 6371*2*Math.asin(Math.sqrt(Math.min(1,Math.max(0,h))))
}
export function filtrar(locais,{origem=null,cat='todos',busca=''}={}) {
  const termo=normalizar(busca.trim())
  return locais.filter(l=>(cat==='todos'||l.cats.includes(cat))&&(!termo||normalizar([l.nome,l.bairro,l.categoria,...(l.tags||[])].join(' ')).includes(termo)))
    .map(l=>({...l,distancia:temCoordenadas(origem||{})&&temCoordenadas(l)?distanciaKm(origem,l):null}))
    .sort((a,b)=>(origem?(a.distancia??Infinity)-(b.distancia??Infinity):0)||a.nome.localeCompare(b.nome,'pt-BR'))
}
