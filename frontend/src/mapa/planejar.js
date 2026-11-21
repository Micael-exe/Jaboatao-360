import rede from './rede.json'
import { janelas, dias } from './horarios'

// A rede ordena as alternativas para a busca limitada. Apenas a validação
// determinística dos horários pode colocar uma parada no resultado.
function prioridade(tempo, folga, duracao, proximo) {
  const x = [Math.min(2, tempo / 60), Math.min(2, folga / 120), duracao / 60, Math.min(2, proximo / 60), 1]
  return rede.pesos.reduce((soma, w, i) =>
    soma + rede.saida[i] * Math.tanh(w.reduce((s, peso, j) => s + peso * x[j], 0)), rede.saida.at(-1))
}
export function preparar(locais, relogio) {
  const aptos = [], fora = []
  for (const local of locais) {
    const faixas = janelas(local.horarios, relogio.dia)
    let motivo
    if (!faixas) motivo = 'Horário a confirmar'
    else if (!faixas.length) motivo = `Fechado · ${dias[relogio.dia].toLowerCase()}`
    else if (!faixas.some(([a, b]) => Math.max(relogio.partida, a) + local.duracaoMin <= b)) {
      motivo = 'O tempo restante de abertura não comporta a visita.'
    }
    if (motivo) fora.push({ local, motivo })
    else aptos.push({ ...local, faixas })
  }
  return { aptos, fora }
}

// Índice 0 da matriz = origem. Para o mesmo conjunto de visitas e mesma
// última parada, chegar mais cedo domina chegar mais tarde. Até 9 lugares
// mantemos todos esses estados. Acima disso, mantemos 64 alternativas por nível.
export function planejar(locais, matriz, partida) {
  const inicial = { ultimo: 0, mascara: 0n, fim: partida, custo: 0, paradas: [], nota: 0 }
  let frente = [inicial], melhor = inicial
  const bits = locais.map((_, i) => 1n << BigInt(i))
  const proximidade = locais.map((_, i) => {
    const trechos = matriz[i + 1].slice(1).filter((t, j) => j !== i && Number.isFinite(t))
    return trechos.length ? Math.min(...trechos) : 0
  })
  while (frente.length) {
    const proximos = new Map()
    for (const estado of frente) {
      locais.forEach((local, i) => {
        const viagem = matriz[estado.ultimo][i + 1]
        if ((estado.mascara & bits[i]) || !Number.isFinite(viagem)) return
        const chegada = estado.fim + viagem
        const faixa = local.faixas.find(([a, b]) => Math.max(chegada, a) + local.duracaoMin <= b)
        if (!faixa) return
        const inicio = Math.max(chegada, faixa[0]), fim = inicio + local.duracaoMin
        const mascara = estado.mascara | bits[i], chave = `${mascara}:${i}`
        const anterior = proximos.get(chave)
        if (anterior && anterior.fim < fim) return
        const custo = estado.custo + inicio - estado.fim
        const paradas = [...estado.paradas, { local, indice: i + 1, viagem, chegada, inicio, fim }]
        const nota = estado.nota + prioridade(inicio - estado.fim, faixa[1] - fim, local.duracaoMin, proximidade[i])
        if (anterior && anterior.fim === fim && anterior.nota >= nota) return
        const novo = { ultimo: i + 1, mascara, custo, fim, paradas, nota }
        proximos.set(chave, novo)
        if (paradas.length > melhor.paradas.length || (paradas.length === melhor.paradas.length &&
            (custo < melhor.custo || (custo === melhor.custo && nota > melhor.nota)))) melhor = novo
      })
    }
    frente = [...proximos.values()]
    if (locais.length > 9 && frente.length > 64) {
      frente.sort((a, b) => (b.nota - a.nota) || (a.custo - b.custo))
      frente.length = 64
    }
  }
  return melhor.paradas
}
