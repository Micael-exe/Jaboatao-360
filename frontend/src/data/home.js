// Conteúdo da página inicial. Os números e os comércios em destaque vêm de
// `dados.js`, para que a home nunca fique fora de sincronia com o catálogo.
import { atrativos, comercios } from './dados'

const bairroDe = (id) => atrativos.find((a) => a.id === id)?.bairro

// `foto` é o nome do arquivo (sem extensão) em src/assets/jaboatao/.
// Sem o arquivo, o bloco simplesmente não mostra imagem.
export const heroFoto = { nome: 'hero' }

// Atrativo com foto em destaque.
export const destaquePrincipal = {
  id: 'a-3',
  nome: 'Igreja de Nossa Senhora do Pilar',
  categoria: 'Patrimônio histórico',
  bairro: bairroDe('a-3'),
  descricao: 'Igreja do século XVII, símbolo da história colonial de Jaboatão dos Guararapes.',
  foto: 'pilar',
  alt: 'Fachada barroca de igreja com duas torres, frontão ornamentado e portas verdes',
}

// Demais atrativos. Se um deles ganhar foto em src/assets/jaboatao/, ela aparece como miniatura.
export const destaques = [
  {
    id: 'a-1',
    nome: 'Praia de Piedade',
    categoria: 'Praia',
    bairro: bairroDe('a-1'),
    descricao: 'Uma das praias mais procuradas do litoral sul de Pernambuco, com águas calmas e boa infraestrutura.',
    foto: 'piedade',
    alt: 'Praia de Piedade, em Jaboatão dos Guararapes',
  },
  {
    id: 'a-2',
    nome: 'Praia de Candeias',
    categoria: 'Praia',
    bairro: bairroDe('a-2'),
    descricao: 'Praia urbana com calçadão, quiosques e movimento durante todo o ano.',
    foto: 'candeias',
    alt: 'Calçadão e faixa de areia da Praia de Candeias',
  },
  {
    id: 'a-4',
    nome: 'Parque Histórico Nacional dos Guararapes',
    categoria: 'Parque',
    bairro: bairroDe('a-4'),
    descricao: 'Palco das Batalhas dos Guararapes (1648–1649), marco da formação do Brasil. Patrimônio nacional.',
    foto: 'guararapes',
    alt: 'Área verde do Parque Histórico Nacional dos Guararapes',
  },
  {
    id: 'a-5',
    nome: 'Praia de Barra de Jangada',
    categoria: 'Praia',
    bairro: bairroDe('a-5'),
    descricao: 'Praia tranquila na foz do Rio Jaboatão, frequentada por famílias e pescadores locais.',
    foto: 'barra-de-jangada',
    alt: 'Praia de Barra de Jangada, na foz do Rio Jaboatão',
  },
  {
    id: 'a-6',
    nome: 'Morro da Conceição',
    categoria: 'Ponto cultural',
    bairro: bairroDe('a-6'),
    descricao: 'Elevação com vista panorâmica e forte presença religiosa e cultural na região.',
    foto: 'morro-da-conceicao',
    alt: 'Morro da Conceição visto à distância',
  },
]

export const atalhos = [
  { id: 'mapa', to: '/mapa', titulo: 'Mapa', texto: 'Os atrativos da cidade localizados no mapa.' },
  { id: 'roteiros', to: '/roteiros', titulo: 'Roteiros', texto: 'Monte e salve um passeio com atrativos e comércios locais.' },
  { id: 'comercio', to: '/comercio', titulo: 'Comércio local', texto: 'Onde comer, comprar e fazer passeios perto de cada atrativo.' },
  { id: 'perfil', to: '/perfil', titulo: 'Perfil', texto: 'Seus interesses, favoritos e roteiros salvos.' },
]

// Números reais, calculados a partir dos dados do projeto.
export const indicadores = [
  { valor: atrativos.length, rotulo: 'atrativos turísticos' },
  { valor: comercios.length, rotulo: 'comércios e experiências' },
  {
    valor: new Set([...atrativos, ...comercios].map((i) => i.bairro)).size,
    rotulo: 'bairros',
  },
]

// Mistura de tipos: gastronomia, experiência guiada e cultura.
const idsComercioDestaque = ['c-1', 'c-5', 'c-7']
export const comerciosEmDestaque = comercios.filter((c) => idsComercioDestaque.includes(c.id))
