// Treino reproduzível por imitação. Para cada passeio sintético de quatro
// paradas, a busca exaustiva fornece os exemplos de melhores primeiras visitas.
// Execute com node scripts/treinar-roteiro.mjs na pasta frontend.
import { writeFileSync } from 'node:fs'
let semente = 360
function aleatorio() {
  semente = (Math.imul(semente, 1664525) + 1013904223) >>> 0
  return semente / 2 ** 32
}
const pesos = Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => aleatorio() - 0.5))
const saida = Array.from({ length: 7 }, () => aleatorio() - 0.5)
function custo(a, b) { return Math.ceil(Math.hypot(a.x - b.x, a.y - b.y)) }
function avaliar(origem, instante, locais) {
  let melhor = { total: 0, custo: 0 }
  const opcoes = []
  for (const local of locais) {
    const viagem = custo(origem, local)
    const inicio = Math.max(instante + viagem, local.abre)
    const fim = inicio + local.duracao
    if (fim > local.fecha) continue
    const resto = locais.filter(item => item !== local)
    const proxima = avaliar(local, fim, resto).melhor
    const opcao = { total: proxima.total + 1, custo: inicio - instante + proxima.custo,
      entradas: [Math.min(2, (inicio - instante) / 60), Math.min(2, (local.fecha - fim) / 120),
        local.duracao / 60, resto.length ? Math.min(2, Math.min(...resto.map(p => custo(local, p))) / 60) : 0] }
    opcoes.push(opcao)
    if (opcao.total > melhor.total || (opcao.total === melhor.total && opcao.custo < melhor.custo)) melhor = opcao
  }
  return { melhor, opcoes }
}
for (let treino = 0; treino < 18000; treino++) {
  const locais = Array.from({ length: 4 }, () => {
    const abre = Math.floor(aleatorio() * 85)
    return { x: aleatorio() * 45, y: aleatorio() * 45, abre,
      fecha: abre + 30 + Math.floor(aleatorio() * 220), duracao: 10 + Math.floor(aleatorio() * 50) }
  })
  const { melhor, opcoes } = avaliar({ x: 0, y: 0 }, 0, locais)
  for (const opcao of opcoes) {
    const x = [...opcao.entradas, 1]
    const h = pesos.map(w => Math.tanh(w.reduce((s, v, i) => s + v * x[i], 0)))
    const logit = h.reduce((s, v, i) => s + v * saida[i], saida[6])
    const alvo = Number(opcao.total === melhor.total && opcao.custo === melhor.custo)
    const delta = 0.015 * (alvo - 1 / (1 + Math.exp(-logit)))
    h.forEach((v, i) => {
      const ajuste = delta * saida[i] * (1 - v * v)
      x.forEach((entrada, j) => { pesos[i][j] += ajuste * entrada })
      saida[i] += delta * v
    })
    saida[6] += delta
  }
}
writeFileSync(new URL('../src/mapa/rede.json', import.meta.url),
  JSON.stringify({ pesos, saida }, (_, n) => typeof n === 'number' ? +n.toFixed(7) : n) + '\n')
