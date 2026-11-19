# Mapa interativo do Jaboatão 360

Com a nova funcionalidade, quem abrir o mapa poderá escolher lugares pelas fotos e receber um roteiro com a ordem das visitas e o horário sugerido para cada parada.

1. Implemente primeiro o filtro de interesses e confirme que a API retorna os lugares com as tags escolhidas.
2. Use os lugares filtrados para montar os cartões com fotos. Registre os escolhidos ao deslizar para a direita e pule os demais ao deslizar para a esquerda.
3. Com a seleção concluída, use o ponto de partida e os lugares escolhidos para gerar o roteiro com a rede neural e exibir o trajeto e os horários no mapa.
## 1. Escolher os interesses

Ao abrir o mapa (`/mapa`), a pessoa verá a pergunta **“O que você gostaria de explorar em Jaboatão?”**. Poderá escolher um ou mais temas, como praias ou história. O mapa buscará na API os locais que tenham pelo menos uma das tags escolhidas. Se a busca vier vazia, a pessoa poderá mudar o filtro.

## 2. Selecionar os lugares pelas fotos

O mapa mostrará um lugar por vez, com o nome e uma foto escolhida pela equipe. A pessoa poderá deslizar a foto em duas direções.

- **Direita — Quero visitar.** Inclui o lugar no roteiro.
- **Esquerda — Pular.** Passa ao próximo lugar.

Depois de escolher pelo menos um lugar, a pessoa poderá tocar em **Montar roteiro** a qualquer momento. Ao terminar a última foto, seguirá para a escolha do ponto de partida. Se tiver pulado todos os lugares, poderá rever as fotos ou mudar os interesses.

## 3. Ver o roteiro no mapa

A pessoa poderá usar a localização atual, com sua permissão, ou escolher outro ponto de partida no mapa. A partir desse ponto, a rede neural organizará os lugares selecionados para reduzir o tempo de deslocamento e sugerir visitas dentro dos horários de funcionamento informados pela API.

O mapa mostrará o trajeto com as paradas numeradas. Em cada parada, a pessoa verá o horário de funcionamento e o horário sugerido para chegar. Se um lugar não couber no roteiro enquanto estiver aberto, o mapa indicará isso ao lado do nome.
