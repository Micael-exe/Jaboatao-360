import { describe, expect, it } from 'vitest'
import { categorias, cnpjValido, emailValido, nomeDoEmail } from './acesso'

describe('acesso', () => {
  it('tem as três categorias', () => {
    expect(categorias.map((c) => c.id)).toEqual(['turista', 'empreendedor', 'empresa'])
  })

  it('valida e-mail', () => {
    expect(emailValido('ana@exemplo.com')).toBe(true)
    expect(emailValido('ana@exemplo')).toBe(false)
  })

  it('valida CNPJ pelos dígitos verificadores', () => {
    expect(cnpjValido('11.222.333/0001-81')).toBe(true)
    expect(cnpjValido('11222333000182')).toBe(false)
    expect(cnpjValido('11111111111111')).toBe(false)
    expect(cnpjValido('123')).toBe(false)
  })

  it('gera um nome a partir do e-mail', () => {
    expect(nomeDoEmail('ana.souza@exemplo.com')).toBe('Ana souza')
  })

})
