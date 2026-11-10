// Foto de um atrativo. As imagens ficam em src/assets/jaboatao/<nome>.(jpg|jpeg|png|webp|avif).
// Sem o arquivo, mostra uma ilustração neutra (decorativa) em vez de uma imagem quebrada.
const arquivos = import.meta.glob('../../assets/jaboatao/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

function buscarFoto(nome) {
  const caminho = Object.keys(arquivos).find(
    (c) => c.split('/').pop().replace(/\.[^.]+$/, '') === nome,
  )
  return caminho ? arquivos[caminho] : null
}

export default function Foto({ nome, alt, className = '', prioridade = false }) {
  const src = buscarFoto(nome)

  if (!src) {
    return (
      <div className={`home-foto home-foto--vazia ${className}`} aria-hidden="true" data-testid="foto-vazia">
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="home-foto-svg">
          <circle cx="292" cy="96" r="44" className="fo-sol" />
          <path d="M0 196q50-34 100 0t100 0 100 0 100 0V300H0z" className="fo-onda fo-onda-1" />
          <path d="M0 230q50-30 100 0t100 0 100 0 100 0V300H0z" className="fo-onda fo-onda-2" />
          <path d="M0 262q50-24 100 0t100 0 100 0 100 0V300H0z" className="fo-onda fo-onda-3" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`home-foto ${className}`}
      loading={prioridade ? 'eager' : 'lazy'}
      fetchPriority={prioridade ? 'high' : undefined}
      decoding="async"
    />
  )
}
