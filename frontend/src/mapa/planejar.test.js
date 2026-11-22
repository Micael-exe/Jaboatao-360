import { afterEach, describe, expect, it, vi } from 'vitest'
import { filtrarLocais, lerCatalogo } from './catalogo'
import { agoraEmJaboatao, janelas, situacao } from './horarios'
import { planejar, preparar } from './planejar'
import { gerarRoteiro } from './rotas'

const museu = { id: 'M', nome: 'Museu', tags: ['Museu', 'Artesanato'], lat: -8.18, lng: -34.91, duracaoMin: 30,
  horarios: [[], ...Array(5).fill([['10:00', '14:00']]), [['12:00', '15:00']]] }
const feira = { ...museu, id: 'F', nome: 'Feira', lat: -8.17, tags: ['Artesanato'], horarios: Array(7).fill([['09:00', '17:00']]) }
const matriz = [[0, 20, 5], [20, 0, 15], [5, 15, 0]]
const origem = { lat: -8.16, lng: -34.9 }
const sexta = new Date('2026-11-20T16:00:00Z')
afterEach(() => vi.unstubAllGlobals())

describe('catálogo e interesses', () => {
  it('reúne as tags aceitas, exclui qualquer veto e inclui novas categorias em Outros', () => {
    const parque = { ...feira, id: 'P', tags: ['Parque'] }
    expect(filtrarLocais([museu, feira, parque], { Museus: 'sim', Artesanato: 'nao', Outros: 'sim' })).toEqual([parque])
    expect(filtrarLocais([museu], { Museus: 'sim', Artesanato: 'sim' })).toEqual([museu])
    expect(filtrarLocais([parque], {})).toEqual([])
  })
  it('deduplica IDs e resolve a foto relativa ao endereço da API', () => {
    const registro = { ...museu, foto: './foto.jpg' }
    const locais = lerCatalogo({ locais: [registro, { ...registro, tags: ['Bar'] }] }, 'https://exemplo.test/api/locais')
    expect(locais).toHaveLength(1)
    expect(locais[0].foto).toBe('https://exemplo.test/api/foto.jpg')
    expect(filtrarLocais(locais, { Museus: 'sim', Bares: 'nao' })).toEqual([])
    expect(() => lerCatalogo([{ ...museu, lng: null }])).toThrow()
  })
})
describe('visitas no horário de Jaboatão', () => {
  it('usa o dia e a hora de Recife inclusive perto da meia-noite UTC', () => {
    expect(agoraEmJaboatao(new Date('2026-11-22T01:30:00Z'))).toMatchObject({ dia: 6, minuto: 1350 })
  })
  it('prioriza a visita que fecha primeiro para conseguir visitar museu e feira', () => {
    const { aptos } = preparar([museu, feira], { dia: 5, partida: 780 })
    const paradas = planejar(aptos, matriz, 780)
    expect(paradas.map(p => [p.local.id, p.inicio, p.fim])).toEqual([['M', 800, 830], ['F', 845, 875]])
  })
  it('espera o museu abrir no sábado e aceita a última visita completa', () => {
    const { aptos } = preparar([museu], { dia: 6, partida: 700 })
    expect(situacao(museu.horarios, { dia: 6, minuto: 660 })).toMatch(/abre às 12:00/)
    expect(planejar(aptos, [[0, 10], [10, 0]], 700)[0]).toMatchObject({ chegada: 710, inicio: 720 })
    expect(planejar(aptos, [[0, 10], [10, 0]], 860)[0].fim).toBe(900)
    expect(planejar(aptos, [[0, 10], [10, 0]], 861)).toEqual([])
  })
  it('respeita pausa, horário ausente e virada de um período noturno', () => {
    const feiraComPausa = { ...feira, horarios: { 5: [['09:00', '12:00'], ['13:00', '17:00']] } }
    const { aptos } = preparar([feiraComPausa], { dia: 5, partida: 700 })
    expect(planejar(aptos, [[0, 5], [5, 0]], 700)[0].inicio).toBe(780)
    expect(janelas({ 5: [['22:00', '02:00']], 6: [] }, 6)).toEqual([[0, 120]])
    expect(situacao({}, { dia: 1, minuto: 600 })).toBe('Horário a confirmar')
  })
  it('desempata pelo menor deslocamento e espera, inclusive com matriz assimétrica', () => {
    const { aptos } = preparar([feira, { ...feira, id: 'B' }], { dia: 5, partida: 600 })
    const paradas = planejar(aptos, [[0, 12, 3], [12, 0, 20], [3, 2, 0]], 600)
    expect(paradas.map(p => p.local.id)).toEqual(['B', 'F'])
  })
  it('avalia uma seleção grande sem repetir paradas nem ultrapassar o fechamento', () => {
    const locais = Array.from({ length: 12 }, (_, i) => ({ ...feira, id: String(i), duracaoMin: 10 }))
    const { aptos } = preparar(locais, { dia: 5, partida: 600 })
    const tempos = Array.from({ length: 13 }, (_, i) => Array.from({ length: 13 }, (_, j) => Math.abs(i - j)))
    const paradas = planejar(aptos, tempos, 600)
    expect(new Set(paradas.map(p => p.local.id)).size).toBe(12)
    expect(paradas.every(p => p.fim <= 17 * 60)).toBe(true)
  })
  it('atribui motivo a cada visita impossível sem consultar ruas para locais fechados', async () => {
    const rede = vi.fn()
    vi.stubGlobal('fetch', rede)
    const r = await gerarRoteiro(origem, [museu, { ...feira, horarios: null }], new AbortController().signal,
      new Date('2026-11-22T14:00:00Z'))
    expect(r.fora.map(p => p.motivo)).toEqual(['Fechado · domingo', 'Horário a confirmar'])
    expect(rede).not.toHaveBeenCalled()
  })
  it('revalida a visita quando o trecho real demora mais do que a matriz previa', async () => {
    const resposta = dados => ({ ok: true, json: async () => ({ code: 'Ok', ...dados }) })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(resposta({ durations: [[0, 600], [600, 0]] }))
      .mockResolvedValueOnce(resposta({ routes: [{ duration: 2400, geometry: { coordinates: [[-34.9, -8.16], [-34.91, -8.18]] } }] })))
    const resultado = await gerarRoteiro(origem, [museu], new AbortController().signal, sexta)
    expect(resultado.paradas).toHaveLength(0)
    expect(resultado.fora[0].local.id).toBe('M')
  })
  it('continua com os trechos alcançáveis e desenha as ruas retornadas pelo serviço', async () => {
    const resposta = json => ({ ok: true, json: async () => ({ code: 'Ok', ...json }) })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(resposta({ durations: [[0, null, 300], [null, 0, null], [300, null, 0]] }))
      .mockResolvedValueOnce(resposta({ routes: [{ duration: 300, geometry: { coordinates: [[-34.9, -8.16], [-34.91, -8.17]] } }] })))
    const resultado = await gerarRoteiro(origem, [museu, feira], new AbortController().signal, sexta)
    expect(resultado.paradas.map(p => p.local.id)).toEqual(['F'])
    expect(resultado.fora[0].motivo).toMatch(/Sem trajeto/)
    expect(resultado.tracados[0][1]).toEqual([-8.17, -34.91])
  })
})
