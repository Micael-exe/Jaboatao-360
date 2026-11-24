import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Perfil from './Perfil'

const renderPerfil = () =>
  render(
    <MemoryRouter>
      <Perfil />
    </MemoryRouter>,
  )

describe('Tela de Perfil', () => {
  it('mostra os dados iniciais e o resumo', () => {
    renderPerfil()
    expect(screen.getByRole('heading', { name: 'Visitante Jaboatão' })).toBeInTheDocument()
    expect(screen.getByText('Roteiros salvos')).toBeInTheDocument()
  })

  it('atualiza os dados da conta ao salvar', async () => {
    const user = userEvent.setup()
    renderPerfil()
    const campoNome = screen.getByDisplayValue('Visitante Jaboatão')
    await user.clear(campoNome)
    await user.type(campoNome, 'Maria')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(screen.getByText(/Dados atualizados/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Maria' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('j360_conta')).nome).toBe('Maria')
  })

  it('troca a cor do avatar ao salvar', async () => {
    const user = userEvent.setup()
    renderPerfil()
    await user.click(screen.getByRole('button', { name: 'Cor do avatar: Sol' }))
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(JSON.parse(localStorage.getItem('j360_conta')).avatar).toBe('sol')
  })

  it('salva interesses automaticamente', async () => {
    const user = userEvent.setup()
    renderPerfil()
    await user.click(screen.getByRole('button', { name: /Preferências/ }))
    await user.click(screen.getByRole('button', { name: /Aventura/ }))
    expect(JSON.parse(localStorage.getItem('j360_preferencias')).interesses).toContain('aventura')
  })

  it('liga e desliga notificações', async () => {
    const user = userEvent.setup()
    renderPerfil()
    await user.click(screen.getByRole('button', { name: /Preferências/ }))
    const opcao = screen.getByRole('checkbox', { name: /Ofertas do comércio local/ })
    expect(opcao).not.toBeChecked()
    await user.click(opcao)
    expect(opcao).toBeChecked()
  })

  it('registra e remove visitas no histórico', async () => {
    const user = userEvent.setup()
    renderPerfil()
    await user.click(screen.getByRole('button', { name: /Histórico de visitas/ }))
    expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(2)

    fireEvent.change(document.querySelector('input[type="date"]'), {
      target: { value: '2026-10-01' },
    })
    await user.click(screen.getByRole('button', { name: '+ Registrar visita' }))
    expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(3)

    await user.click(screen.getAllByRole('button', { name: 'Remover' })[0])
    expect(screen.getAllByRole('button', { name: 'Remover' })).toHaveLength(2)
  })
})
