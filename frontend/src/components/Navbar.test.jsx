import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const entrar = () => localStorage.setItem('j360_sessao', JSON.stringify({ categoria: 'turista', email: 'ana@exemplo.com' }))

const renderNavbar = (rota = '/') =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Navbar />
    </MemoryRouter>,
  )

describe('Navbar', () => {
  it('esconde mapa, roteiros, comércio e perfil sem login', () => {
    renderNavbar()
    expect(screen.queryByRole('link', { name: 'Mapa' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Roteiros' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Comércio' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Perfil' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/sobre')
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
  })

  it('exibe os links das novas telas com login', () => {
    entrar()
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Roteiros' })).toHaveAttribute('href', '/roteiros')
    expect(screen.getByRole('link', { name: 'Comércio' })).toHaveAttribute('href', '/comercio')
    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/perfil')
  })

  it('esconde o Entrar depois do login', () => {
    entrar()
    renderNavbar()
    expect(screen.queryByRole('link', { name: 'Entrar' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Perfil' })).toBeInTheDocument()
  })

  it('mantém os links originais com login', () => {
    entrar()
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute('href', '/mapa')
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/sobre')
  })

  it('destaca apenas a página atual', () => {
    entrar()
    renderNavbar('/roteiros')
    expect(screen.getByRole('link', { name: 'Roteiros' })).toHaveClass('underline')
    expect(screen.getByRole('link', { name: 'Perfil' })).not.toHaveClass('underline')
  })
})
