import { describe, expect, it } from 'vitest'
import { senhaValida } from './acesso'

describe('senhaValida', () => {
  it.each(['Segredo1!', 'Abc123#x', 'Ação2024@', 'Maria$99'])('aceita %s', (senha) => {
    expect(senhaValida(senha)).toBe(true)
  })

  it.each([
    ['segredo1!', 'sem maiúscula'],
    ['Segredo!!', 'sem número'],
    ['Segredo12', 'sem caractere especial'],
    ['Seg1!', 'com menos de 6 caracteres'],
    ['Segredo 1', 'espaço não conta como caractere especial'],
  ])('recusa %s (%s)', (senha) => {
    expect(senhaValida(senha)).toBe(false)
  })
})
