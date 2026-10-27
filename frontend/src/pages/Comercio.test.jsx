import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Comercio from './Comercio'

const renderComercio = () =>
  render(
    <MemoryRouter>
      <Comercio />
    </MemoryRouter>,
  )

describe('Tela de Comércio local', () => {
  it('lista todos os locais ao abrir', () => {
    renderComercio()
    expect(screen.getByRole('heading', { name: '9 resultados' })).toBeInTheDocument()
  })

  it('busca por texto', async () => {
    const user = userEvent.setup()
    renderComercio()
    await user.type(screen.getByPlaceholderText(/Buscar por nome/), 'jangada')
    expect(screen.getByRole('heading', { name: '1 resultado' })).toBeInTheDocument()
    expect(screen.getByText('Passeio de Jangada')).toBeInTheDocument()
  })

  it('filtra por tipo', async () => {
    const user = userEvent.setup()
    renderComercio()
    await user.click(screen.getByRole('button', { name: 'Experiência' }))
    expect(screen.getByRole('heading', { name: '3 resultados' })).toBeInTheDocument()
  })

  it('avisa quando nada é encontrado', async () => {
    const user = userEvent.setup()
    renderComercio()
    await user.type(screen.getByPlaceholderText(/Buscar por nome/), 'xyzxyz')
    expect(screen.getByText('Nenhum local encontrado com esses filtros.')).toBeInTheDocument()
  })

  it('favorita um local e persiste a escolha', async () => {
    const user = userEvent.setup()
    renderComercio()
    await user.click(screen.getAllByLabelText('Favoritar')[0])
    expect(screen.getAllByLabelText('Remover dos favoritos')).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem('j360_favoritos_comercio'))).toEqual(['c-1'])
  })

  it('adiciona um local ao roteiro e mostra o atalho', async () => {
    const user = userEvent.setup()
    renderComercio()
    await user.click(screen.getAllByRole('button', { name: '+ Adicionar ao roteiro' })[0])

    expect(screen.getByRole('button', { name: '✓ Adicionado!' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver roteiro/ })).toHaveAttribute('href', '/roteiros')
    expect(JSON.parse(localStorage.getItem('j360_rascunho')).paradas).toHaveLength(1)
  })
})
