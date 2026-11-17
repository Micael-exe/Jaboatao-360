export default function StatsBar({ itens = [] }) {
  if (itens.length === 0) return null

  return (
    <dl className="home-stats" aria-label="Jaboatão 360 em números">
      {itens.map(({ valor, rotulo }) => (
        <div key={rotulo} className="home-stat">
          <dt>{rotulo}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
