# Mapa interativo do Jaboatão 360

Ao abrir a tela `/mapa`, a pessoa poderá montar um passeio em Jaboatão mesmo sem saber o nome dos lugares que deseja visitar. Primeiro, ela responderá **Sim** ou **Não** para cada tipo de passeio que quiser avaliar. Na tela seguinte, verá fotos dos lugares que passaram pelo filtro e escolherá quais quer visitar. Com essas escolhas e um ponto de partida, o mapa mostrará por onde começar, em que ordem seguir e a que horas vale a pena chegar a cada parada.

## 1. Filtrar por interesse

A primeira tela terá o título **Filtro de interesses** e a instrução **“Marque Sim para o que te interessa neste passeio e Não para o que prefere deixar de fora.”** Cada linha terá duas opções. Marcar uma delas substituirá a resposta anterior apenas naquela linha.

| Interesse | Tenho interesse | Prefiro deixar de fora |
| --- | --- | --- |
| Praias | ( ) Sim | ( ) Não |
| Shoppings | ( ) Sim | ( ) Não |
| Museus | ( ) Sim | ( ) Não |
| Artesanato | ( ) Sim | ( ) Não |
| Restaurantes | ( ) Sim | ( ) Não |
| Bares | ( ) Sim | ( ) Não |
| Outros | ( ) Sim | ( ) Não |

**Outros** reúne as categorias de interesse cadastradas na API que vão além das seis listadas. Se a equipe cadastrar **Parques**, por exemplo, marcar **Sim** em **Outros** permitirá ver fotos de parques. Novas categorias de interesse entrarão nesse grupo automaticamente.

**Regras propostas para o filtro.** Todas as linhas começarão em branco. Com pelo menos um **Sim**, a pessoa poderá tocar em **Ver lugares**. Uma categoria em branco ficará sem preferência. Se todas estiverem em branco ou marcadas como **Não**, a tela orientará a pessoa a marcar ao menos um interesse para ver as fotos.

Cada categoria corresponderá a uma tag no back-end. A resposta em **Outros** valerá para todas as categorias desse grupo. Para aparecer nos cartões, um lugar deverá ter ao menos uma tag marcada como **Sim**. Uma tag marcada como **Não** excluirá o lugar deste passeio, inclusive quando ele tiver outra tag marcada como **Sim**. Por exemplo, quem marcar **Sim** para Museus e Artesanato e **Não** para Bares verá museus e feiras de artesanato. Um museu também classificado como artesanato aparecerá uma única vez. Um local classificado como artesanato e bar ficará fora da lista.

Se nenhum lugar atender às respostas, o mapa manterá as escolhas e oferecerá **Alterar interesses**. Se a API falhar, a tela oferecerá **Tentar novamente** com as mesmas respostas.

## 2. Escolher pelas fotos e decidir quando parar

Cada cartão representará **um lugar**. A foto de destaque será a que a equipe pré-selecionou para aquele local. O nome e o tema ficarão visíveis junto à imagem para a pessoa saber o que está escolhendo. Mesmo que o local tenha várias fotos na API, um gesto registrará uma única decisão sobre o lugar.

| Ação | O que acontece |
| --- | --- |
| Deslizar para a direita ou tocar em **Quero visitar** | Guarda o lugar para este passeio, atualiza a contagem e mostra o próximo cartão. |
| Deslizar para a esquerda ou tocar em **Pular** | Deixa o lugar fora deste passeio e mostra o próximo cartão. |

Os dois botões também poderão ser usados com o teclado. A tela mostrará o progresso, por exemplo, **8 de 12 lugares vistos · 3 escolhidos**. A partir da primeira escolha, o botão **Montar roteiro** permitirá encerrar a seleção. Nesse exemplo, tocar no botão enviará somente os três escolhidos. Os quatro cartões ainda por ver ficarão fora do cálculo.

Ao terminar o último cartão, a tela seguirá para o ponto de partida se houver algum lugar escolhido. Se a pessoa tiver pulado todos, poderá **Rever os lugares** ou **Alterar interesses**. A seleção de um único lugar também será válida. Nesse caso, o mapa calculará a ida direta e verificará se a visita cabe no horário de funcionamento.

## 3. Definir de onde e quando sair

A pessoa poderá tocar em **Usar minha localização** ou **Escolher no mapa**. A primeira opção pedirá permissão para usar a posição do aparelho. A segunda permitirá marcar e confirmar outro ponto, como o hotel de onde a pessoa pretende sair. Se ela já tiver indicado um ponto de partida, o mapa o mostrará para confirmação. Se o aparelho não conseguir obter a posição, a escolha manual continuará disponível e os lugares escolhidos serão mantidos.

Para esta proposta, o cálculo usará como referência a **saída agora**, no horário local de Jaboatão. A tela mostrará essa referência antes de gerar o roteiro. Ela importa porque sair às 9h e sair às 16h do mesmo ponto pode mudar a ordem das visitas e quais paradas ainda cabem no dia.

## 4. Transformar as escolhas em um roteiro viável

A rede neural receberá o ponto de partida, a data e a hora de saída e os lugares escolhidos. Para cada lugar, receberá também os horários de funcionamento por dia da semana e a indicação de **aberto** ou **fechado** no momento da consulta. O serviço de roteiros usará os horários cadastrados na API e a hora local de Jaboatão para determinar essa indicação. Para planejar cada parada, levará em conta o horário previsto de chegada e as estimativas de percurso e de duração da visita.

**Exemplo de funcionamento de um museu**

| Dia da semana | Funcionamento |
| --- | --- |
| Segunda a sexta-feira | Das 10:00 às 14:00 |
| Sábado | Das 12:00 às 15:00 |
| Domingo | Fechado o dia inteiro |

1. **Comparar ordens de visita.** A rede sugerirá sequências considerando o tempo de percurso desde a origem e entre as paradas. O cálculo usará o caminho percorrível para o meio de transporte adotado. Dois pontos próximos no mapa podem exigir uma volta longa pelas ruas. Um local mais distante também poderá vir primeiro se fechar mais cedo.
2. **Consultar o dia da visita.** O cálculo usará o horário correspondente ao dia de cada parada. No museu do exemplo, às 11:00 de sexta-feira a indicação será **Aberto até as 14:00**. Às 11:00 de sábado, será **Fechado agora. Abre às 12:00**. No domingo, o museu aparecerá entre os lugares escolhidos com o aviso **Fechado aos domingos** e ficará fora do trajeto daquele dia.
3. **Conferir se a visita cabe inteira.** No sábado, uma chegada às 11:50 permitirá sugerir o início às 12:00, com dez minutos de espera. Para uma visita de meia hora, o último início possível será às 14:30. Às 14:45 o museu ainda estará aberto, mas restarão apenas 15 minutos. Nesse caso, o serviço tentará antecipar a parada. Se houver uma pausa no funcionamento, a visita deverá caber inteira em um dos períodos abertos. A saída de cada parada servirá de base para calcular a próxima chegada.
4. **Escolher a sequência.** A prioridade proposta é acomodar o maior número de lugares escolhidos enquanto estiverem abertos. Entre sequências que atendam ao mesmo número de lugares, terá preferência a de menor tempo somado de deslocamento e espera.

Aqui, **horário sugerido** significa a hora de iniciar a visita que melhor se encaixa naquele passeio. A indicação levará em conta as paradas anteriores e o funcionamento do local. Quando faltar o horário de um lugar, ele aparecerá entre os escolhidos com **Horário a confirmar**. Quando houver horário conhecido, mas nenhuma visita couber no período aberto, a tela mostrará o motivo ao lado do lugar. Assim, a pessoa saberá o que aconteceu com cada escolha.

## 5. Ler o resultado no mapa

O mapa mostrará o ponto de partida, o traçado do percurso e as paradas numeradas na ordem sugerida. A lista abaixo seguirá a mesma numeração. Ao tocar em um marcador, a pessoa verá o nome do lugar, se ele está aberto ou fechado naquele momento, os horários por dia da semana, o tempo estimado desde o ponto anterior e o início sugerido da visita. Quando houver espera até a abertura, a lista mostrará tanto a chegada prevista quanto o início da visita.

Se nenhuma visita couber nos horários disponíveis, a tela mostrará os lugares escolhidos com seus motivos e oferecerá **Rever escolhas**. Se o serviço de rotas estiver indisponível, a pessoa poderá tentar o cálculo novamente com a mesma origem e seleção.

**Exemplo de leitura com horários fictícios.** Uma pessoa marca **Sim** para Museus e Artesanato, escolhe o museu do exemplo e uma feira de artesanato e sai às 13:00 de sexta-feira. O museu fecha às 14:00 e a feira às 17:00. A visita prevista é de 30 minutos em cada local. Da origem, são 5 minutos até a feira ou 20 até o museu. Entre os dois, são 15 minutos.

| Parada | Funcionamento | Visita sugerida | Motivo da ordem |
| --- | --- | --- | --- |
| 1. Museu | 10:00 às 14:00 | 13:20 às 13:50 | A visita cabe inteira antes do fechamento. |
| 2. Feira | 09:00 às 17:00 | 14:05 às 14:35 | Após o museu, ainda há tempo para visitar a feira. |

Começando pela feira, a pessoa sairia de lá às 13:35 e chegaria ao museu às 13:50, com apenas dez minutos para uma visita de meia hora.

## Ordem de implementação e verificação

| Etapa | O que entregar | Como verificar antes de avançar |
| --- | --- | --- |
| 1. Filtro | Associar as respostas Sim e Não de cada categoria às tags da API. | Marcar Sim para Museus e Artesanato e Não para Bares. Conferir se um museu de artesanato aparece uma vez e se um bar com artesanato fica fora da lista. |
| 2. Cartões | Transformar os locais filtrados em cartões e reunir os identificadores dos escolhidos. | Escolher um local à direita, pular outro à esquerda e encerrar antes do último cartão. Apenas o primeiro deve seguir para o roteiro. |
| 3. Origem e cálculo | Usar a seleção da etapa anterior, confirmar a origem e validar as sequências sugeridas pela rede. | Recusar o acesso à localização, marcar a origem manualmente e reproduzir o exemplo do museu e da feira. |
| 4. Resultado | Usar a sequência validada para desenhar o percurso e preencher a lista de horários. | Conferir se mapa e lista mostram a mesma ordem e se cada lugar escolhido tem uma parada ou uma explicação visível. |

**Decisões para a equipe validar antes de programar o cálculo.** Além da saída imediata e da prioridade descrita acima, é preciso definir qual meio de transporte servirá de referência e como estimar a duração de cada visita. Esses valores afetam diretamente o horário sugerido e podem mudar a ordem do passeio.
