export default function StatsBar({ itens = [] }) {
  if (itens.length === 0) return null

  return (
    <section className="home-stats" aria-label="Jaboatão 360 em números">
      <div className="home-container">
        <dl className="home-stats-lista">
          {itens.map(({ valor, rotulo }) => (
            <div key={rotulo} className="home-stat">
              <dt>{rotulo}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
