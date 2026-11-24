// Categorias de acesso, validações e gravação da sessão demonstrativa.
// Sem servidor por enquanto: conta e sessão ficam só neste navegador e a senha nunca é guardada.

export const categorias = [
  {
    id: 'turista',
    rotulo: 'Turista',
    descricao: 'Para turistas e moradores que usam o guia para conhecer Jaboatão e organizar passeios.',
    chamadaCadastro: 'Crie sua conta para guardar roteiros, favoritos e as visitas que fizer.',
    beneficios: [
      'Montar e salvar roteiros pelos atrativos do município',
      'Marcar comércios locais como favoritos',
      'Registrar as visitas que já fez',
    ],
  },
  {
    id: 'empreendedor',
    rotulo: 'Empreendedor',
    descricao: 'Para quem toca um negócio próprio, como quiosque, passeio guiado ou ateliê.',
    chamadaCadastro: 'Cadastre o seu negócio para aparecer no guia de comércio local.',
    beneficios: [
      'Aparecer perto dos atrativos que reúnem público',
      'Acompanhar como o seu negócio aparece no guia',
      'Receber as novidades voltadas ao comércio local',
    ],
  },
  {
    id: 'empresa',
    rotulo: 'Empresa',
    descricao: 'Para empresas com CNPJ, como restaurantes, hotéis e agências de turismo.',
    chamadaCadastro: 'Cadastre a empresa com o CNPJ e divulgue seus serviços para turistas e moradores.',
    beneficios: [
      'Divulgar serviços e experiências para quem visita a cidade',
      'Manter os dados da empresa em um só lugar',
      'Receber as novidades voltadas ao comércio local',
    ],
  },
]

export const ramos = [
  'Gastronomia',
  'Artesanato',
  'Passeios e turismo',
  'Hospedagem',
  'Comércio em geral',
  'Outro',
]

export const emailValido = (valor) => /^\S+@\S+\.\S+$/.test(valor)

// Senha: 6 caracteres ou mais, com pelo menos uma letra maiúscula, um número e um caractere especial
export const senhaValida = (valor) =>
  valor.length >= 6 &&
  valor !== valor.toLowerCase() &&
  /\d/.test(valor) &&
  /[^\p{L}\p{N}\s]/u.test(valor)

export const mensagemSenha =
  'A senha precisa ter pelo menos 6 caracteres, com uma letra maiúscula, um número e um caractere especial.'

export function cnpjValido(valor) {
  const n = String(valor).replace(/\D/g, '')
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const digito = (tamanho) => {
    const pesos = tamanho === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const resto = pesos.reduce((soma, p, i) => soma + Number(n[i]) * p, 0) % 11
    return resto < 2 ? 0 : 11 - resto
  }
  return digito(12) === Number(n[12]) && digito(13) === Number(n[13])
}

export const nomeDoEmail = (email) => {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Visitante Jaboatão'
}

const lerJson = (chave) => {
  try {
    return JSON.parse(localStorage.getItem(chave))
  } catch {
    return null
  }
}

// Quem entrou (login ou cadastro) tem a sessão gravada; sem ela, as telas restritas ficam ocultas.
export const estaLogado = () => Boolean(lerJson('j360_sessao'))

const gravarJson = (chave, valor) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // armazenamento indisponível: ignora
  }
}

// modo 'login': mantém o que já estava salvo na conta e só atualiza e-mail e categoria.
// modo 'cadastro': monta uma conta nova com os dados informados (mantém apenas o avatar).
export function iniciarSessao({ categoria, email, modo, dados = {} }) {
  const atual = lerJson('j360_conta') ?? {}
  const informados = Object.fromEntries(
    Object.entries(dados).filter(([, valor]) => valor !== undefined && valor !== ''),
  )
  const padrao = {
    nome: nomeDoEmail(email),
    cidade: 'Jaboatão dos Guararapes',
    avatar: atual.avatar ?? 'espuma',
  }
  const base = modo === 'cadastro' ? padrao : { ...padrao, ...atual }

  gravarJson('j360_conta', { ...base, ...informados, email, tipoUsuario: categoria.rotulo })
  gravarJson('j360_sessao', { categoria: categoria.id, email, entrouEm: new Date().toISOString() })
}
