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

export { emailValido, senhaValida, mensagemSenha, cnpjValido } from './regras'

export const nomeDoEmail = (email) => {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'Visitante Jaboatão'
}

