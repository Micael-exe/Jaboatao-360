import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Campo from './Campo'
import CampoSenha from './CampoSenha'
import { cnpjValido, emailValido, iniciarSessao, mensagemSenha, ramos, senhaValida } from '../../data/acesso'

const rotuloNome = {
  turista: 'Nome',
  empreendedor: 'Seu nome',
  empresa: 'Nome do responsável',
}

const vazio = {
  nome: '', email: '', cidade: '', negocio: '', ramo: '', bairro: '', cnpj: '', senha: '', confirmar: '',
}

export default function FormularioCadastro({ categoria }) {
  const navigate = useNavigate()
  const [v, setV] = useState(vazio)
  const [erro, setErro] = useState('')

  const turista = categoria.id === 'turista'
  const empresa = categoria.id === 'empresa'
  const id = (campo) => `cadastro-${categoria.id}-${campo}`
  const muda = (campo) => (e) => setV((atual) => ({ ...atual, [campo]: e.target.value }))

  const validar = () => {
    if (v.nome.trim().length < 2) return 'Informe o seu nome.'
    if (!emailValido(v.email)) return 'Informe um e-mail válido.'
    if (!turista && !v.negocio.trim()) {
      return empresa ? 'Informe o nome da empresa.' : 'Informe o nome do negócio.'
    }
    if (empresa && !cnpjValido(v.cnpj)) return 'Informe um CNPJ válido.'
    if (!turista && !v.ramo) return 'Escolha o ramo de atuação.'
    if (!senhaValida(v.senha)) return mensagemSenha
    if (v.senha !== v.confirmar) return 'As senhas não coincidem.'
    return ''
  }

  const cadastrar = (e) => {
    e.preventDefault()
    const problema = validar()
    if (problema) {
      setErro(problema)
      return
    }
    iniciarSessao({
      categoria,
      email: v.email,
      modo: 'cadastro',
      dados: {
        nome: v.nome.trim(),
        cidade: v.cidade.trim(),
        negocio: turista ? undefined : v.negocio.trim(),
        ramo: turista ? undefined : v.ramo,
        bairro: turista ? undefined : v.bairro.trim(),
        cnpj: empresa ? v.cnpj.replace(/\D/g, '') : undefined,
      },
    })
    navigate('/perfil')
  }

  return (
    <form onSubmit={cadastrar} className="perfil-form acesso-cadastro" noValidate>
      <div className="perfil-campos">
        <Campo id={id('nome')} rotulo={rotuloNome[categoria.id]} autoComplete="name" value={v.nome} onChange={muda('nome')} required />
        <Campo
          id={id('email')}
          rotulo={empresa ? 'E-mail corporativo' : 'E-mail'}
          type="email"
          autoComplete="email"
          value={v.email}
          onChange={muda('email')}
          required
        />

        {turista && (
          <Campo id={id('cidade')} rotulo="Cidade de origem (opcional)" value={v.cidade} onChange={muda('cidade')} />
        )}

        {!turista && (
          <>
            <Campo
              id={id('negocio')}
              rotulo={empresa ? 'Nome da empresa' : 'Nome do negócio'}
              value={v.negocio}
              onChange={muda('negocio')}
              required
            />
            {empresa && (
              <Campo
                id={id('cnpj')}
                rotulo="CNPJ"
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                value={v.cnpj}
                onChange={muda('cnpj')}
                required
              />
            )}
            <Campo id={id('ramo')} rotulo="Ramo de atuação">
              <select id={id('ramo')} className="input" value={v.ramo} onChange={muda('ramo')} required>
                <option value="">Selecione</option>
                {ramos.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Campo>
            <Campo id={id('bairro')} rotulo="Bairro (opcional)" value={v.bairro} onChange={muda('bairro')} />
          </>
        )}

        <CampoSenha
          id={id('senha')}
          valor={v.senha}
          aoMudar={(valor) => setV((atual) => ({ ...atual, senha: valor }))}
          autoComplete="new-password"
        />
        <CampoSenha
          id={id('confirmar')}
          rotulo="Confirmar senha"
          valor={v.confirmar}
          aoMudar={(valor) => setV((atual) => ({ ...atual, confirmar: valor }))}
          autoComplete="new-password"
        />
      </div>

      {erro && <p className="acesso-erro" role="alert">{erro}</p>}

      <div className="perfil-acoes">
        <button type="submit" className="home-btn home-btn--verde">Criar conta</button>
      </div>
    </form>
  )
}
