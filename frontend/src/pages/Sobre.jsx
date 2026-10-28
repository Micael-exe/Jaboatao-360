export default function Sobre() {
  return (
    <main className="page page-narrow">

      <h1 className="page-title">Sobre o Jaboatão 360</h1>
      <p className="page-lead">Projeto acadêmico — Análise e Desenvolvimento de Sistemas (ADS)</p>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3">A problemática</h2>
        <p className="text-gray-600 leading-relaxed">
          Jaboatão dos Guararapes é o segundo município mais populoso de Pernambuco e possui
          um rico patrimônio histórico, cultural e natural — praias, parques, igrejas históricas
          e marcos das Batalhas dos Guararapes. Apesar disso, grande parte desses atrativos
          permanece pouco conhecida, tanto por moradores quanto por visitantes, pela falta de
          uma plataforma acessível e centralizada de informações turísticas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Motivação</h2>
        <p className="text-gray-600 leading-relaxed">
          O projeto nasceu da vontade de valorizar o município e aproximar as pessoas dos
          espaços que ele oferece. A tecnologia é usada como ferramenta para ampliar a
          visibilidade dos atrativos locais, incentivar o turismo sustentável e fortalecer
          o comércio e os empreendedores da região.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Objetivos</h2>
        <ul className="space-y-2 text-gray-600">
          {[
            'Valorizar o patrimônio histórico, cultural e natural de Jaboatão.',
            'Facilitar o acesso às informações turísticas do município.',
            'Incentivar a visitação dos atrativos locais.',
            'Conectar turistas, moradores e empreendedores.',
            'Promover o turismo sustentável e o comércio local.',
          ].map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Nossa proposta</h2>
        <p className="text-gray-600 leading-relaxed">
          O <strong>Jaboatão 360</strong> é uma plataforma web — e futuramente mobile — que
          reúne em um só lugar os principais atrativos turísticos do município, com mapa
          interativo, informações detalhadas e, em versões futuras, roteiros personalizados
          por inteligência artificial e um sistema de gamificação para incentivar a exploração.
        </p>
      </section>

      <section className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Contexto acadêmico</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Este MVP foi desenvolvido como projeto prático do curso de <strong>Análise e
          Desenvolvimento de Sistemas (ADS)</strong>, aplicando conhecimentos em:
        </p>
        <div className="flex flex-wrap gap-2">
          {['React', 'Vite', 'Django', 'Django REST Framework', 'PostgreSQL', 'Leaflet', 'OpenStreetMap', 'Vercel', 'Render'].map((tech) => (
            <span key={tech} className="bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </section>

    </main>
  )
}