import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const renderNavbar = (rota = '/') =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Navbar />
    </MemoryRouter>,
  )

describe('Navbar', () => {
  it('exibe os links das novas telas', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Roteiros' })).toHaveAttribute('href', '/roteiros')
    expect(screen.getByRole('link', { name: 'Comércio' })).toHaveAttribute('href', '/comercio')
    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/perfil')
  })

  it('mantém os links originais', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute('href', '/mapa')
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/sobre')
  })

  it('destaca apenas a página atual', () => {
    renderNavbar('/roteiros')
    expect(screen.getByRole('link', { name: 'Roteiros' })).toHaveClass('underline')
    expect(screen.getByRole('link', { name: 'Perfil' })).not.toHaveClass('underline')
  })
})
