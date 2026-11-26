import { exemplo } from '../test/conta'
import { snapshot } from '../data/banco'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Cadastro from './Cadastro'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (_url,op) => {
    const v=JSON.parse(op.body)
    const dados={...v.conta,email:v.email,tipoUsuario:{turista:'Turista',empreendedor:'Empreendedor',empresa:'Empresa'}[v.categoria]}
    if (dados.cnpj) dados.cnpj=dados.cnpj.replace(/\D/g,'')
    return {ok:true,json:async()=>exemplo(dados)}
  }))
})
afterEach(() => vi.unstubAllGlobals())

const renderCadastro = (rota = '/cadastro') =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<h1>Tela de login</h1>} />
        <Route path="/perfil" element={<h1>Tela de perfil</h1>} />
      </Routes>
    </MemoryRouter>,
  )

const conta = () => snapshot()?.dados.conta ?? null

describe('Tela de Cadastro', () => {
  it('cada categoria pede os próprios campos', async () => {
    const user = userEvent.setup()
    renderCadastro()
    expect(screen.getByRole('heading', { name: 'Cadastro de turista' })).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade de origem (opcional)')).toBeInTheDocument()
    expect(screen.queryByLabelText('CNPJ')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Empreendedor' }))
    expect(screen.getByLabelText('Nome do negócio')).toBeInTheDocument()
    expect(screen.getByLabelText('Ramo de atuação')).toBeInTheDocument()
    expect(screen.queryByLabelText('CNPJ')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Empresa' }))
    expect(screen.getByLabelText('Nome da empresa')).toBeInTheDocument()
    expect(screen.getByLabelText('CNPJ')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do responsável')).toBeInTheDocument()
  })

  it('cadastra um turista e vai para o perfil', async () => {
    const user = userEvent.setup()
    renderCadastro()
    await user.type(screen.getByLabelText('Nome'), 'Maria Lima')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await user.type(screen.getByLabelText('Cidade de origem (opcional)'), 'Recife')
    await user.type(screen.getByLabelText('Senha'), 'Segredo1!')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Segredo1!')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByRole('heading', { name: 'Tela de perfil' })).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/cadastro', expect.objectContaining({
      method: 'POST', body: expect.stringContaining('maria@exemplo.com'),
    }))
    expect(conta()).toMatchObject({ nome: 'Maria Lima', email: 'maria@exemplo.com', cidade: 'Recife', tipoUsuario: 'Turista' })
    expect(localStorage.getItem('j360_conta')).toBeNull()
  })

  it('recusa senhas diferentes', async () => {
    const user = userEvent.setup()
    renderCadastro()
    await user.type(screen.getByLabelText('Nome'), 'Maria Lima')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Segredo1!')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Segredo2!')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('não coincidem')
    expect(localStorage.getItem('j360_conta')).toBeNull()
  })

  it('cadastra um empreendedor com o negócio e o ramo', async () => {
    const user = userEvent.setup()
    renderCadastro('/cadastro?categoria=empreendedor')
    await user.type(screen.getByLabelText('Seu nome'), 'José Pereira')
    await user.type(screen.getByLabelText('E-mail'), 'jose@exemplo.com')
    await user.type(screen.getByLabelText('Nome do negócio'), 'Quiosque do Zé')
    await user.selectOptions(screen.getByLabelText('Ramo de atuação'), 'Gastronomia')
    await user.type(screen.getByLabelText('Senha'), 'Segredo1!')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Segredo1!')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(conta()).toMatchObject({ tipoUsuario: 'Empreendedor', negocio: 'Quiosque do Zé', ramo: 'Gastronomia' })
  })

  it('exige CNPJ válido para empresa e grava só os dígitos', async () => {
    const user = userEvent.setup()
    renderCadastro('/cadastro?categoria=empresa')
    await user.type(screen.getByLabelText('Nome do responsável'), 'Carla Dias')
    await user.type(screen.getByLabelText('E-mail corporativo'), 'contato@empresa.com')
    await user.type(screen.getByLabelText('Nome da empresa'), 'Hotel Beira Mar')
    await user.type(screen.getByLabelText('CNPJ'), '11.222.333/0001-82')
    await user.selectOptions(screen.getByLabelText('Ramo de atuação'), 'Hospedagem')
    await user.type(screen.getByLabelText('Senha'), 'Segredo1!')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Segredo1!')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(screen.getByRole('alert')).toHaveTextContent('CNPJ válido')

    await user.clear(screen.getByLabelText('CNPJ'))
    await user.type(screen.getByLabelText('CNPJ'), '11.222.333/0001-81')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(conta()).toMatchObject({ tipoUsuario: 'Empresa', cnpj: '11222333000181', negocio: 'Hotel Beira Mar' })
  })

  it('recusa senha sem maiúscula, número ou caractere especial', async () => {
    const user = userEvent.setup()
    renderCadastro()
    await user.type(screen.getByLabelText('Nome'), 'Maria Lima')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    for (const senha of ['segredo1!', 'Segredoo!', 'Segredo12']) {
      await user.clear(screen.getByLabelText('Senha'))
      await user.clear(screen.getByLabelText('Confirmar senha'))
      await user.type(screen.getByLabelText('Senha'), senha)
      await user.type(screen.getByLabelText('Confirmar senha'), senha)
      await user.click(screen.getByRole('button', { name: 'Criar conta' }))
      expect(screen.getByRole('alert')).toHaveTextContent('caractere especial')
    }
    expect(localStorage.getItem('j360_conta')).toBeNull()
  })

  it.each([
    ['invalido', 'inválido'],
    ['inconclusivo', 'confirmar'],
    ['indisponivel', 'indisponível'],
    ['limite', 'Aguarde'],
  ])('bloqueia o cadastro quando a API responde %s', async (estado, mensagem) => {
    fetch.mockResolvedValueOnce({ ok: false, status: estado === 'limite' ? 429 : 422, json: async () => ({ mensagem }) })
    const user = userEvent.setup()
    renderCadastro()
    await user.type(screen.getByLabelText('Nome'), 'Maria')
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Segredo1!')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Segredo1!')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(mensagem)
    expect(conta()).toBeNull()
    expect(localStorage.getItem('j360_sessao')).toBeNull()
    expect(screen.getByLabelText('Nome')).toHaveValue('Maria')
  })

  it('leva ao login pelo link', async () => {
    const user = userEvent.setup()
    renderCadastro()
    await user.click(screen.getByRole('link', { name: 'Entrar' }))
    expect(screen.getByRole('heading', { name: 'Tela de login' })).toBeInTheDocument()
  })
})
