import { dias, funcionamento, hora, situacao } from './horarios'

export function Semana({ local }) {
  return <details className="map-semana">
    <summary>Horários da semana</summary>
    <dl>{[1, 2, 3, 4, 5, 6, 0].map(dia =>
      <div key={dia}><dt>{dias[dia]}</dt><dd>{funcionamento(local.horarios, dia)}</dd></div>)}</dl>
  </details>
}

export default function DetalheParada({ parada, relogio }) {
  const { local, viagem, chegada, inicio, fim } = parada
  return <>
    <h3>{local.nome}</h3>
    <p>{situacao(local.horarios, relogio)} · {viagem} min de carro</p>
    <p>Visita sugerida <strong>{hora(inicio)}–{hora(fim)}</strong></p>
    {inicio > chegada && <p>Chegada às {hora(chegada)} · espera de {inicio - chegada} min.</p>}
    <Semana local={local} />
  </>
}
