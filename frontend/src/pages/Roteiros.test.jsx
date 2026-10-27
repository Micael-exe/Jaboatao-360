import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Roteiros from './Roteiros'

const botoesAdicionar = () => screen.getAllByRole('button', { name: '+ Adicionar' })
const nomeDoRoteiro = () => screen.getByPlaceholderText('Nome do roteiro')
const nomesNoEditor = () =>
  within(document.querySelector('ol')).getAllByText(/^Praia de/).map((el) => el.textContent)

describe('Tela de Roteiros', () => {
  it('mostra os estados vazios ao abrir', () => {
    render(<Roteiros />)
    expect(screen.getByText(/Nenhuma parada ainda/)).toBeInTheDocument()
    expect(screen.getByText('Você ainda não salvou nenhum roteiro.')).toBeInTheDocument()
  })

  it('não salva um roteiro sem nome', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.click(screen.getByRole('button', { name: 'Salvar roteiro' }))
    expect(screen.getByText(/Dê um nome ao seu roteiro/)).toBeInTheDocument()
  })

  it('não salva um roteiro sem paradas', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.type(nomeDoRoteiro(), 'Meu passeio')
    await user.click(screen.getByRole('button', { name: 'Salvar roteiro' }))
    expect(screen.getByText(/Adicione ao menos uma parada/)).toBeInTheDocument()
  })

  it('cria e salva um roteiro com uma parada', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.type(nomeDoRoteiro(), 'Meu passeio')
    await user.click(botoesAdicionar()[0])
    await user.click(screen.getByRole('button', { name: 'Salvar roteiro' }))

    expect(screen.getByText(/Roteiro salvo com sucesso/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Meu passeio' })).toBeInTheDocument()
    expect(screen.getByText(/1 parada/)).toBeInTheDocument()
    expect(nomeDoRoteiro()).toHaveValue('')
    expect(JSON.parse(localStorage.getItem('j360_roteiros'))).toHaveLength(1)
  })

  it('reorganiza as paradas com os botões de subir e descer', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.click(botoesAdicionar()[0])
    await user.click(botoesAdicionar()[1])
    expect(nomesNoEditor()).toEqual(['Praia de Piedade', 'Praia de Candeias'])

    await user.click(screen.getAllByLabelText('Subir')[1])
    expect(nomesNoEditor()).toEqual(['Praia de Candeias', 'Praia de Piedade'])
  })

  it('remove uma parada do roteiro', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.click(botoesAdicionar()[0])
    await user.click(screen.getByLabelText('Remover'))
    expect(screen.getByText(/Nenhuma parada ainda/)).toBeInTheDocument()
  })

  it('filtra o catálogo por comércio', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.click(screen.getByRole('button', { name: 'Comércio' }))
    expect(screen.getByText('Quiosque Sabor do Mar')).toBeInTheDocument()
    expect(screen.queryByText('Praia de Candeias')).not.toBeInTheDocument()
  })

  it('duplica e exclui roteiros salvos', async () => {
    const user = userEvent.setup()
    render(<Roteiros />)
    await user.type(nomeDoRoteiro(), 'Meu passeio')
    await user.click(botoesAdicionar()[0])
    await user.click(screen.getByRole('button', { name: 'Salvar roteiro' }))

    await user.click(screen.getByRole('button', { name: 'Duplicar' }))
    expect(screen.getByRole('heading', { name: 'Meu passeio (cópia)' })).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Excluir' })[0])
    expect(screen.getAllByRole('button', { name: 'Excluir' })).toHaveLength(1)
  })
})
