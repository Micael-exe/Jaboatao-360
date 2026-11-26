import { beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'
import App from './App'
import { simularConta } from './test/conta'
import { receberConta, snapshot } from './data/banco'

beforeEach(() => window.history.pushState({}, '', '/'))

describe('Rotas protegidas', () => {
  it.each(['/mapa', '/roteiros', '/comercio', '/perfil'])(
    'leva %s para o login quando não há sessão',
    (rota) => {
      window.history.pushState({}, '', rota)
      render(<App />)
      expect(screen.getByRole('heading', { name: 'Login de turista' })).toBeInTheDocument()
      expect(window.location.pathname).toBe('/login')
    },
  )

  it('abre o perfil quando há sessão', () => {
    simularConta({nome:'Ana'})
    window.history.pushState({}, '', '/perfil')
    render(<App />)
    expect(window.location.pathname).toBe('/perfil')
    expect(screen.getByRole('heading', { level: 1, name: 'Ana' })).toBeInTheDocument()
  })

  it('sai pelo perfil, oculta os links restritos e preserva os dados locais', async () => {
    simularConta({nome:'Ana'})
    localStorage.setItem('j360_roteiros', '[]')
    window.history.pushState({}, '', '/perfil')
    render(<App />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Sair da conta' }))
    expect(window.location.pathname).toBe('/login')
    expect(localStorage.getItem('j360_sessao')).toBeNull()
    expect(snapshot()).toBeNull()
    expect(localStorage.getItem('j360_roteiros')).toBe('[]')
    expect(screen.queryByRole('link', { name: 'Perfil' })).not.toBeInTheDocument()
  })

  it('fecha a tela protegida quando outra aba encerra a sessão', () => {
    simularConta({nome:'Ana'})
    window.history.pushState({}, '', '/roteiros')
    render(<App />)
    act(() => {
      receberConta(null)
    })
    expect(window.location.pathname).toBe('/login')
  })

  it('mantém as páginas públicas abertas sem sessão', () => {
    window.history.pushState({}, '', '/sobre')
    render(<App />)
    expect(window.location.pathname).toBe('/sobre')
  })
})
