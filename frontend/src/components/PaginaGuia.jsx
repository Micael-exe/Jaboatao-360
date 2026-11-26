import '../pages/Home.css'
import '../pages/Sobre.css'
import '../pages/Guia.css'

export default function PaginaGuia({ pagina, titulo, descricao, children }) {
  return (
    <main className={`home guia guia--${pagina}`}>
      <header className="guia-topo" data-nav-tema="escura">
        <div className="home-container guia-cabecalho">
          <h1 className="sobre-hero-titulo">{titulo}</h1>
          <p className="sobre-hero-texto">{descricao}</p>
        </div>
      </header>
      <div className="home-container guia-corpo" data-nav-tema="clara">{children}</div>
    </main>
  )
}
