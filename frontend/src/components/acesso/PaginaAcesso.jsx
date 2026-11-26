import { Link, useSearchParams } from 'react-router-dom'
import CtaBand from '../home/CtaBand'
import Footer from '../Footer'
import FormularioLogin from './FormularioLogin'
import FormularioCadastro from './FormularioCadastro'
import { categorias } from '../../data/acesso'
import '../../pages/Home.css' // tokens de cor, container, botões e chamada final compartilhados com a home
import '../../pages/Sobre.css' // topo escuro, índice lateral e títulos de seção
import '../../pages/Perfil.css' // formulários e botões compartilhados com o perfil
import '../../pages/Acesso.css'

const textos = {
  login: {
    eyebrow: 'Entrar',
    titulo: 'Escolha como você usa o Jaboatão 360.',
    lead: 'Cada categoria tem a sua entrada. Escolha a que combina com você e acesse o seu perfil.',
    aviso:
      'Entre com o e-mail e a senha cadastrados e selecione o seu perfil.',
  },
  cadastro: {
    eyebrow: 'Cadastro',
    titulo: 'Crie sua conta no Jaboatão 360.',
    lead: 'Escolha a categoria, preencha os dados e comece a usar. Cada categoria pede as informações que fazem sentido para ela.',
    aviso:
      'O cadastro consulta a Abstract para verificar se o e-mail pode receber mensagens. Apenas o endereço é enviado. Seus dados ficam vinculados à conta.',
  },
}

export default function PaginaAcesso({ modo }) {
  const [params, setParams] = useSearchParams()
  const atual = categorias.find((c) => c.id === params.get('categoria')) ?? categorias[0]
  const t = textos[modo]
  const cadastro = modo === 'cadastro'
  const minuscula = atual.rotulo.toLowerCase()

  return (
    <div className="home sobre perfil acesso">
      <main>
        <section className="sobre-hero" aria-labelledby="acesso-titulo-pagina" data-nav-tema="escura">
          <div className="home-container sobre-hero-grid">
            <div>
              <p className="perfil-eyebrow">{t.eyebrow}</p>
              <h1 id="acesso-titulo-pagina" className="sobre-hero-titulo">{t.titulo}</h1>
              <p className="sobre-hero-texto">{t.lead}</p>
            </div>
          </div>
        </section>

        <div className="home-section sobre-corpo" data-nav-tema="clara">
          <div className="home-container sobre-grid">
            <nav className="sobre-indice perfil-indice" aria-label="Categorias de acesso">
              <p className="sobre-indice-titulo">Eu sou</p>
              <ul>
                {categorias.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setParams({ categoria: c.id }, { replace: true })}
                      aria-current={atual.id === c.id ? 'true' : undefined}
                    >
                      {c.rotulo}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="perfil-conteudo">
              <p className="notice">{t.aviso}</p>

              <section aria-labelledby="acesso-categoria-titulo">
                <h2 id="acesso-categoria-titulo" className="sobre-h2">
                  {cadastro ? `Cadastro de ${minuscula}` : `Login de ${minuscula}`}
                </h2>
                <p className="sobre-prosa sobre-lead acesso-texto">
                  {cadastro ? atual.chamadaCadastro : atual.descricao}
                </p>

                <div className={`acesso-grid ${cadastro ? 'acesso-grid--cadastro' : ''}`}>
                  <div>
                    {/* key: cada categoria monta o próprio formulário, com campos e erros separados */}
                    {cadastro ? (
                      <FormularioCadastro key={atual.id} categoria={atual} />
                    ) : (
                      <FormularioLogin key={atual.id} categoria={atual} />
                    )}
                    <p className="acesso-troca">
                      {cadastro ? 'Já tem conta? ' : 'Ainda não tem conta? '}
                      <Link to={`${cadastro ? '/login' : '/cadastro'}?categoria=${atual.id}`}>
                        {cadastro ? 'Entrar' : 'Cadastre-se'}
                      </Link>
                    </p>
                  </div>

                  <aside className="acesso-beneficios" aria-label={`O que ${minuscula} acessa`}>
                    <h3 className="perfil-h3">O que você acessa</h3>
                    <ul className="sobre-lista">
                      {atual.beneficios.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </aside>
                </div>
              </section>
            </div>
          </div>
        </div>

        <CtaBand
          titulo="Prefere só conhecer a cidade?"
          texto="Conheça o Jaboatão 360 e a história da cidade antes de criar sua conta."
          acao={{ to: '/sobre', rotulo: 'Conhecer o guia' }}
        />
      </main>
      <Footer />
    </div>
  )
}
