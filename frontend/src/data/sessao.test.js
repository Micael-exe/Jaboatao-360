import { beforeEach, describe, expect, it } from 'vitest'
import { estaLogado, iniciarSessao, categorias } from './acesso'

beforeEach(() => localStorage.clear())

describe('estaLogado', () => {
  it('é falso sem sessão gravada', () => {
    expect(estaLogado()).toBe(false)
  })

  it('é verdadeiro depois do login ou cadastro', () => {
    iniciarSessao({ categoria: categorias[0], email: 'ana@exemplo.com', modo: 'login' })
    expect(estaLogado()).toBe(true)
  })

  it('volta a ser falso se a sessão for apagada', () => {
    iniciarSessao({ categoria: categorias[0], email: 'ana@exemplo.com', modo: 'login' })
    localStorage.removeItem('j360_sessao')
    expect(estaLogado()).toBe(false)
  })

  it('ignora sessão corrompida', () => {
    localStorage.setItem('j360_sessao', '{quebrado')
    expect(estaLogado()).toBe(false)
  })
})
