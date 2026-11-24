import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Login from './Login'

const renderLogin = (rota = '/login') =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<h1>Tela de cadastro</h1>} />
        <Route path="/perfil" element={<h1>Tela de perfil</h1>} />
        <Route path="/mapa" element={<h1>Tela do mapa</h1>} />
      </Routes>
    </MemoryRouter>,
  )

describe('Tela de Login', () => {
  it('começa em turista e lista as três categorias', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: 'Login de turista' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Empreendedor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Empresa' })).toBeInTheDocument()
  })

  it('abre a categoria indicada na URL', () => {
    renderLogin('/login?categoria=empresa')
    expect(screen.getByRole('heading', { name: 'Login de empresa' })).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail corporativo')).toBeInTheDocument()
  })

  it('troca de categoria e mostra o texto de cada uma', async () => {
    const user = userEvent.setup()
    renderLogin()
    expect(screen.queryByRole('button', { name: 'Continuar sem conta' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Empreendedor' }))
    expect(screen.getByRole('heading', { name: 'Login de empreendedor' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Continuar sem conta' })).not.toBeInTheDocument()
  })

  it('recusa e-mail inválido e senha curta', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.type(screen.getByLabelText('E-mail'), 'sem-arroba')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('e-mail válido')

    await user.clear(screen.getByLabelText('E-mail'))
    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await user.clear(screen.getByLabelText('Senha'))
    await user.type(screen.getByLabelText('Senha'), '123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('pelo menos 6')
    expect(localStorage.getItem('j360_sessao')).toBeNull()
  })

  it('recusa senha que não segue as regras do cadastro', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'segredo1')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('caractere especial')
    expect(localStorage.getItem('j360_sessao')).toBeNull()
  })

  it('entra, grava a sessão e a conta e vai para o perfil', async () => {
    const user = userEvent.setup()
    renderLogin('/login?categoria=empreendedor')
    await user.type(screen.getByLabelText('E-mail'), 'ana.souza@exemplo.com')
    await user.type(screen.getByLabelText('Senha'), 'Segredo1!')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('heading', { name: 'Tela de perfil' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('j360_sessao')).categoria).toBe('empreendedor')
    const conta = JSON.parse(localStorage.getItem('j360_conta'))
    expect(conta.tipoUsuario).toBe('Empreendedor')
    expect(conta.nome).toBe('Ana souza')
  })

  it('mostra e oculta a senha', async () => {
    const user = userEvent.setup()
    renderLogin()
    const campo = screen.getByLabelText('Senha')
    expect(campo).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(campo).toHaveAttribute('type', 'text')
  })

  it('leva ao cadastro pelo link', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.click(screen.getByRole('link', { name: 'Cadastre-se' }))
    expect(screen.getByRole('heading', { name: 'Tela de cadastro' })).toBeInTheDocument()
  })
})
