import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useLocalStorage from './useLocalStorage'

describe('useLocalStorage', () => {
  it('usa o valor inicial quando não há nada salvo', () => {
    const { result } = renderHook(() => useLocalStorage('chave', 'inicial'))
    expect(result.current[0]).toBe('inicial')
  })

  it('lê o valor já salvo no navegador', () => {
    localStorage.setItem('chave', JSON.stringify('salvo'))
    const { result } = renderHook(() => useLocalStorage('chave', 'inicial'))
    expect(result.current[0]).toBe('salvo')
  })

  it('grava no localStorage quando o valor muda', () => {
    const { result } = renderHook(() => useLocalStorage('chave', 1))
    act(() => result.current[1](5))
    expect(result.current[0]).toBe(5)
    expect(localStorage.getItem('chave')).toBe('5')
  })

  it('volta ao valor inicial se o conteúdo salvo estiver corrompido', () => {
    localStorage.setItem('chave', '{json-invalido')
    const { result } = renderHook(() => useLocalStorage('chave', 'inicial'))
    expect(result.current[0]).toBe('inicial')
  })
})
