import { simularConta } from '../test/conta'
import { snapshot } from '../data/banco'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import Mapa from './Mapa'
import { carregarLocais, demonstracao } from '../mapa/catalogo'
import { gerarRoteiro } from '../mapa/rotas'

vi.mock('../mapa/catalogo', async importar => ({ ...await importar(), carregarLocais: vi.fn() }))
vi.mock('../mapa/rotas', () => ({ gerarRoteiro: vi.fn() }))
vi.mock('../mapa/MapaFolha', () => ({ default: ({ selecionar }) => selecionar
  ? <button onClick={() => selecionar({ lat: -8.18, lng: -34.92 })}>Usar o centro do mapa</button>
  : <div>Mapa com roteiro</div> }))
beforeEach(() => {
  vi.resetAllMocks()
  carregarLocais.mockResolvedValue(demonstracao)
})
async function inicio() {
  const pessoa = userEvent.setup()
  render(<Mapa />)
  expect(screen.getByRole('button', { name: 'Ver lugares' })).toBeDisabled()
  await pessoa.click(within(screen.getByRole('group', { name: 'Praias' })).getByRole('radio', { name: 'Sim' }))
  await pessoa.click(screen.getByRole('button', { name: 'Ver lugares' }))
  return pessoa
}
it('repete uma consulta com falha e permite alterar um filtro sem resultados', async () => {
  carregarLocais.mockRejectedValueOnce(new Error()).mockResolvedValueOnce([])
  const pessoa = await inicio()
  expect(await screen.findByRole('alert')).toHaveTextContent('carregar os lugares')
  await pessoa.click(screen.getByRole('button', { name: 'Tentar novamente' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Nenhum lugar')
  expect(within(screen.getByRole('group', { name: 'Praias' })).getByRole('radio', { name: 'Sim' })).toBeChecked()
})
it('encerra antes da última foto, preserva a origem após falha e exclui o lugar pulado', async () => {
  simularConta()
  gerarRoteiro.mockRejectedValueOnce(new Error()).mockResolvedValueOnce({
    relogio: { dia: 5, minuto: 780 }, fora: [], tracados: [],
    paradas: [{ local: demonstracao[0], viagem: 20, chegada: 800, inicio: 800, fim: 840 }],
  })
  const pessoa = await inicio()
  await pessoa.click(screen.getByRole('button', { name: /Quero visitar/ }))
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1 de 3 vistos'))
  await pessoa.click(screen.getByRole('button', { name: /Pular/ }))
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('2 de 3 vistos · 1 lugar'))
  await pessoa.click(screen.getByRole('button', { name: 'Montar roteiro' }))
  await pessoa.click(screen.getByRole('button', { name: 'Escolher no mapa' }))
  await pessoa.click(await screen.findByRole('button', { name: 'Usar o centro do mapa' }))
  await pessoa.click(screen.getByRole('button', { name: 'Gerar roteiro' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('trajeto')
  await pessoa.click(screen.getByRole('button', { name: 'Tentar calcular roteiro' }))
  expect(await screen.findByRole('heading', { name: 'Seu roteiro' })).toBeVisible()
  expect(gerarRoteiro.mock.calls[1].slice(0, 2)).toEqual([{ lat: -8.18, lng: -34.92 }, [demonstracao[0]]])
  expect(screen.getByText('13:20–14:00')).toBeVisible()
  await pessoa.click(screen.getByRole('button', { name: 'Salvar em Meus roteiros' }))
  expect(screen.getByRole('button', { name: 'Salvo em Meus roteiros' })).toBeDisabled()
  expect(snapshot().dados.roteiros[0].paradas[0]).toMatchObject({ref: demonstracao[0].id, hora:'13:20'})
})
it('permite rever a seleção se todas as fotos foram puladas', async () => {
  const pessoa = await inicio()
  for (let i = 0; i < 3; i++) {
    await pessoa.click(screen.getByRole('button', { name: /Pular/ }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(`${i + 1} de 3 vistos`))
  }
  await pessoa.click(screen.getByRole('button', { name: 'Rever lugares' }))
  expect(screen.getByRole('status')).toHaveTextContent('0 de 3 vistos')
  fireEvent.click(screen.getByRole('button', { name: 'Alterar interesses' }))
  expect(screen.getByRole('heading', { name: 'Filtro de interesses' })).toBeVisible()
})
