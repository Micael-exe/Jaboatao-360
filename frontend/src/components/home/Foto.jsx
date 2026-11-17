// Foto de um atrativo. As imagens ficam em src/assets/jaboatao/<nome>.(jpg|jpeg|png|webp|avif).
// Sem o arquivo, não renderiza nada: cada bloco decide como ficar sem imagem.
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

export default function Foto({ nome, alt = '', className = '', prioridade = false }) {
  const src = buscarFoto(nome)
  if (!src) return null

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
