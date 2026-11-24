import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import { categorias, iniciarSessao } from './data/acesso'

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
    iniciarSessao({ categoria: categorias[0], email: 'ana@exemplo.com', modo: 'login' })
    window.history.pushState({}, '', '/perfil')
    render(<App />)
    expect(window.location.pathname).toBe('/perfil')
    expect(screen.getByRole('heading', { level: 1, name: 'Ana' })).toBeInTheDocument()
  })

  it('mantém as páginas públicas abertas sem sessão', () => {
    window.history.pushState({}, '', '/sobre')
    render(<App />)
    expect(window.location.pathname).toBe('/sobre')
  })
})
