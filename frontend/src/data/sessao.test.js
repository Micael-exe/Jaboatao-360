import { expect, it, vi } from 'vitest'
import { carregarSessao, contaAntiga, lerLegado, snapshot } from './banco'

it('ignora a antiga sessão demonstrativa e consulta o servidor', async () => {
  localStorage.setItem('j360_sessao','{"email":"ana@example.com"}')
  vi.stubGlobal('fetch',vi.fn(async()=>({ok:true,json:async()=>null})))
  await carregarSessao()
  expect(snapshot()).toBeNull()
})
it('oferece importação apenas para o e-mail correspondente', () => {
  localStorage.setItem('j360_conta','{"email":"Ana@example.com"}')
  localStorage.setItem('j360_favoritos_comercio','["c-2"]')
  expect(contaAntiga('bia@example.com')).toBeNull()
  expect(lerLegado('ana@example.com').dados.favoritos_comercio).toEqual(['c-2'])
  expect(localStorage.getItem('j360_favoritos_comercio')).toBeTruthy()
})
