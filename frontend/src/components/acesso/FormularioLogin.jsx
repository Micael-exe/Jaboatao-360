import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Campo from './Campo'
import CampoSenha from './CampoSenha'
import { emailValido, iniciarSessao, mensagemSenha, senhaValida } from '../../data/acesso'

export default function FormularioLogin({ categoria }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const id = (campo) => `login-${categoria.id}-${campo}`

  const entrar = (e) => {
    e.preventDefault()
    if (!emailValido(email)) {
      setErro('Informe um e-mail válido.')
      return
    }
    if (!senhaValida(senha)) {
      setErro(mensagemSenha)
      return
    }
    iniciarSessao({ categoria, email, modo: 'login' })
    navigate('/perfil')
  }

  return (
    <form onSubmit={entrar} className="perfil-form" noValidate>
      <Campo
        id={id('email')}
        rotulo={categoria.id === 'empresa' ? 'E-mail corporativo' : 'E-mail'}
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <CampoSenha
        id={id('senha')}
        valor={senha}
        aoMudar={setSenha}
        autoComplete="current-password"
      />

      {erro && <p className="acesso-erro" role="alert">{erro}</p>}

      <div className="perfil-acoes">
        <button type="submit" className="home-btn home-btn--verde">Entrar</button>
      </div>
    </form>
  )
}
