import { describe, expect, it } from 'vitest'
import { atrativos, buscarItem, catalogo, comercios } from './dados'

describe('dados demonstrativos', () => {
  it('o catálogo reúne atrativos e comércios', () => {
    expect(catalogo).toHaveLength(atrativos.length + comercios.length)
  })

  it('todos os ids do catálogo são únicos', () => {
    const ids = catalogo.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('buscarItem encontra um item existente', () => {
    expect(buscarItem('a-1').nome).toBe('Praia de Piedade')
  })

  it('buscarItem retorna undefined para id inexistente', () => {
    expect(buscarItem('id-que-nao-existe')).toBeUndefined()
  })

  it('todo comércio aponta para um atrativo que existe', () => {
    const nomes = atrativos.map((a) => a.nome)
    comercios.forEach((c) => expect(nomes).toContain(c.proximoA))
  })
})
