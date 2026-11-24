import { describe, expect, it } from 'vitest'
import { categorias, cnpjValido, emailValido, iniciarSessao, nomeDoEmail } from './acesso'

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

  it('no login mantém os dados já salvos da conta', () => {
    localStorage.setItem('j360_conta', JSON.stringify({ nome: 'Ana', cidade: 'Olinda', avatar: 'sol', email: 'velho@x.com' }))
    iniciarSessao({ categoria: categorias[1], email: 'novo@x.com', modo: 'login' })
    expect(JSON.parse(localStorage.getItem('j360_conta'))).toMatchObject({
      nome: 'Ana', cidade: 'Olinda', avatar: 'sol', email: 'novo@x.com', tipoUsuario: 'Empreendedor',
    })
  })

  it('no cadastro cria conta nova e só mantém o avatar', () => {
    localStorage.setItem('j360_conta', JSON.stringify({ nome: 'Ana', cidade: 'Olinda', avatar: 'sol', negocio: 'Antigo' }))
    iniciarSessao({ categoria: categorias[0], email: 'maria@x.com', modo: 'cadastro', dados: { nome: 'Maria', cidade: '' } })
    const conta = JSON.parse(localStorage.getItem('j360_conta'))
    expect(conta).toMatchObject({ nome: 'Maria', cidade: 'Jaboatão dos Guararapes', avatar: 'sol', tipoUsuario: 'Turista' })
    expect(conta.negocio).toBeUndefined()
  })
})
