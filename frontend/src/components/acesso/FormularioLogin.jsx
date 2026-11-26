import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { autenticar } from '../../data/banco'
import Campo from './Campo'
import CampoSenha from './CampoSenha'
import { emailValido, mensagemSenha, senhaValida } from '../../data/acesso'

export default function FormularioLogin({ categoria }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  const id = (campo) => `login-${categoria.id}-${campo}`

  const [ocupado, setOcupado] = useState(false)
  const entrar = async (e) => {
    e.preventDefault()
    if (!emailValido(email)) {
      setErro('Informe um e-mail válido.')
      return
    }
    if (!senhaValida(senha)) {
      setErro(mensagemSenha)
      return
    }
    if (ocupado) return
    setOcupado(true)
    setErro('')
    try {
      await autenticar('login', { categoria: categoria.id, email, senha })
      navigate('/perfil')
    } catch (falha) { setErro(falha.message) }
    finally { setOcupado(false) }
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
        <button type="submit" disabled={ocupado} className="home-btn home-btn--verde">Entrar</button>
      </div>
    </form>
  )
}
