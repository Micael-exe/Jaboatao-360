import { expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useDadosConta from './useLocalStorage'
import { aguardarGravacao, aviso, snapshot } from '../data/banco'
import { simularConta } from '../test/conta'

it('envia mudanças relacionadas no mesmo PATCH com a revisão da conta',async()=>{
  simularConta()
  const {result}=renderHook(()=>useDadosConta('j360_favoritos_comercio',[]))
  await act(async()=>{ result.current[1](['c-1']); result.current[1](a=>[...a,'c-2']); await aguardarGravacao() })
  expect(result.current[0]).toEqual(['c-1','c-2'])
  expect(fetch.mock.calls).toHaveLength(1)
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({contaId:'id-teste',revisao:0,alteracoes:{favoritos_comercio:['c-1','c-2']}})
})
it('reverte o valor e avisa quando o servidor recusa a gravação',async()=>{
  simularConta()
  fetch.mockResolvedValueOnce({ok:false,status:400,json:async()=>({mensagem:'Dados inválidos'})})
  const {result}=renderHook(()=>useDadosConta('j360_favoritos_comercio',[]))
  await act(async()=>{result.current[1](['x']); await expect(aguardarGravacao()).rejects.toThrow()})
  expect(snapshot().dados.favoritos_comercio).toEqual([])
  expect(aviso()).toContain('inválidos')
})
