# Documentação — Novas telas, testes e pipeline de CI

Projeto **Jaboatão 360** · Frontend (React + Vite + Tailwind)

Este documento resume o que foi desenvolvido nesta entrega: três novas telas, testes automatizados, o uso de IA para apoiar os cenários de teste e a pipeline do GitHub Actions.

---

## 1. Escopo da entrega

| Item | Situação |
|------|----------|
| Tela de Planejamento de roteiros | Criada |
| Tela de Comércio local | Criada |
| Tela de Perfil do usuário | Criada |
| Testes automatizados do frontend | Criados |
| Pipeline GitHub Actions (linter + testes + build) | Criada |
| Badge de status no README | Adicionado |
| Backend | Fora do escopo (não alterado) |

O padrão visual existente foi mantido para que o design possa ser evoluído depois: Tailwind, verde `green-700`, cards `rounded-2xl` com borda cinza, emojis como ícones, contêiner `max-w-5xl` e aviso amarelo de dados demonstrativos.

---

## 2. As telas

### 2.1 Planejamento de roteiros — `/roteiros`
Criação, organização e salvamento de passeios.

- Catálogo de paradas (atrativos e comércios) com filtro por tipo.
- Cada parada pode receber um horário, ser movida para cima ou para baixo e ser removida.
- O roteiro tem nome e data, e só é salvo se tiver nome e ao menos uma parada.
- Roteiros salvos aparecem em cards, com ações de **editar**, **duplicar** e **excluir**.
- O rascunho em andamento é mantido ao trocar de página.

### 2.2 Comércio local — `/comercio`
Divulgação de estabelecimentos e experiências próximas aos atrativos.

- Cards com tipo, categoria, bairro, horário, faixa de preço e atrativo próximo.
- Busca por texto e filtros por tipo (Estabelecimento/Experiência) e categoria.
- Botão de favoritar.
- Botão **"+ Adicionar ao roteiro"**, que envia o item para a tela de roteiros, com atalho para ela.

### 2.3 Perfil do usuário — `/perfil`
Gerenciamento da conta, preferências e histórico de visitas.

- **Resumo:** visitas, atrativos conhecidos, roteiros salvos e favoritos.
- **Conta:** nome, e-mail, cidade, tipo de perfil e avatar.
- **Preferências:** interesses, ritmo dos passeios, faixa de gastos e notificações (salvas automaticamente).
- **Histórico de visitas:** registrar e remover visitas.

### 2.4 Armazenamento
Como ainda não há backend, os dados ficam no `localStorage` do navegador (chaves iniciadas por `j360_`). Os dados de exemplo ficam centralizados em `src/data/dados.js`, o que facilita trocar por chamadas à API no futuro.

---

## 3. Arquivos criados e alterados

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Roteiros.jsx            (novo)
│   │   ├── Comercio.jsx            (novo)
│   │   ├── Perfil.jsx              (novo)
│   │   └── *.test.jsx              (novos — testes das telas)
│   ├── data/dados.js               (novo — dados demonstrativos)
│   ├── data/dados.test.js          (novo)
│   ├── hooks/useLocalStorage.js    (novo)
│   ├── hooks/useLocalStorage.test.js (novo)
│   ├── components/Navbar.jsx       (alterado — 3 links novos)
│   ├── components/Navbar.test.jsx  (novo)
│   ├── test/setup.js               (novo — configuração dos testes)
│   └── App.jsx                     (alterado — 3 rotas novas)
├── vite.config.js                  (alterado — bloco de testes)
└── package.json                    (alterado — scripts e dependências de teste)
.github/workflows/ci.yml            (novo — pipeline)
docs/DOCUMENTACAO.md                (este documento)
README.md                           (alterado — apenas o badge)
```

---

## 4. Como rodar localmente

Dentro da pasta `frontend`:

```bash
npm install        # instala dependências (inclui as de teste)
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run lint       # linter (ESLint)
npm test           # roda os testes uma vez
npm run test:watch # roda os testes em modo observação
npm run build      # build de produção
```

---

## 5. Testes automatizados

**Ferramentas:** Vitest (executor), React Testing Library (renderização e interação) e jsdom (navegador simulado).

Cada teste começa com o `localStorage` limpo, para que um teste não influencie o outro (`src/test/setup.js`).

### 5.1 Cenários cobertos

| Tela / módulo | Cenário | Tipo |
|---|---|---|
| Dados | Ids do catálogo são únicos | Integridade |
| Dados | Todo comércio aponta para um atrativo existente | Integridade |
| Dados | `buscarItem` com id existente e inexistente | Positivo / negativo |
| Hook | Usa valor inicial, lê valor salvo e grava ao alterar | Positivo |
| Hook | Conteúdo corrompido no `localStorage` volta ao valor inicial | Negativo |
| Navbar | Links novos e originais existem com a rota correta | Positivo |
| Navbar | Apenas a página atual fica destacada | Positivo |
| Roteiros | Estados vazios ao abrir | Limite |
| Roteiros | Salvar sem nome é bloqueado | Negativo |
| Roteiros | Salvar sem paradas é bloqueado | Negativo |
| Roteiros | Criar e salvar roteiro com uma parada | Positivo |
| Roteiros | Reordenar paradas (subir/descer) | Positivo |
| Roteiros | Remover parada | Positivo |
| Roteiros | Filtrar catálogo por comércio | Positivo |
| Roteiros | Duplicar e excluir roteiro salvo | Positivo |
| Comércio | Lista completa ao abrir | Positivo |
| Comércio | Busca por texto e filtro por tipo | Positivo |
| Comércio | Busca sem resultados mostra aviso | Limite |
| Comércio | Favoritar e persistir a escolha | Positivo |
| Comércio | Adicionar ao roteiro e exibir atalho | Positivo / integração |
| Perfil | Dados iniciais e resumo | Positivo |
| Perfil | Editar e salvar dados da conta | Positivo |
| Perfil | Interesses salvos automaticamente | Positivo |
| Perfil | Ligar e desligar notificações | Positivo |
| Perfil | Registrar e remover visitas | Positivo |

---

## 6. Uso de IA para apoiar os cenários de teste

A IA (Claude, da Anthropic) foi usada como **assistente de planejamento de testes**, não como substituta da revisão humana.

### 6.1 Como foi usada
1. **Levantamento de cenários:** a IA recebeu o código das telas e sugeriu cenários organizados em quatro categorias: caminho feliz (positivo), entradas inválidas (negativo), situações de borda (listas vazias, busca sem resultado) e integração entre telas (Comércio → Roteiros).
2. **Geração dos testes:** os cenários aprovados foram transformados em testes com Vitest e Testing Library.
3. **Verificação cruzada com os dados:** a IA checou, por exemplo, que os valores esperados nos testes (como "9 resultados" ou "3 resultados") batem com os dados de exemplo.
4. **Correção durante a revisão:** ao revisar o código, a IA apontou que o id de roteiros baseado só em `Date.now()` poderia colidir ao duplicar rapidamente, o que deixaria um teste instável. O gerador de id foi ajustado.

### 6.2 Cuidados adotados
- **Revisão humana obrigatória:** a equipe deve ler e aprovar cada teste sugerido antes do merge.
- **A pipeline é o juiz:** testes escritos por IA só valem depois de passarem no CI. Eles não substituem a execução real.
- **Evitar testes frágeis:** os testes verificam comportamento visível ao usuário (textos, botões, dados salvos), não detalhes internos do código.
- **Reaproveitamento:** ao criar novas telas, repetir o processo acima, pedindo cenários positivos, negativos, de borda e de integração.

### 6.3 Exemplo de pedido (prompt) reutilizável

> Aqui está o componente `NomeDaTela.jsx`. Liste cenários de teste agrupados em: caminho feliz, entradas inválidas, casos de borda e integração com outras telas. Para cada cenário, diga o que o usuário faz e o que deve acontecer. Depois escreva os testes com Vitest e React Testing Library, consultando elementos por papel e texto visível.

---

## 7. Pipeline de CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`

**Quando roda:** a cada `push` em qualquer branch e a cada Pull Request.

**O que faz (na pasta `frontend`):**

1. Baixa o código.
2. Instala o Node.js 22 (com cache do npm).
3. Instala as dependências.
4. Executa o **linter** (`npm run lint`).
5. Executa os **testes** (`npm test`).
6. Executa o **build** de produção (`npm run build`).

Se qualquer etapa falhar, a execução fica vermelha. Em um Pull Request, o resultado aparece na própria página, e é possível exigir que a pipeline passe antes do merge (ver abaixo).

### 7.1 Badge "passing"
O README mostra o status da última execução na branch padrão:

```markdown
[![CI](https://github.com/Micael-exe/jaboatao-360/actions/workflows/ci.yml/badge.svg)](https://github.com/Micael-exe/jaboatao-360/actions/workflows/ci.yml)
```

**Troque `SEU-USUARIO/jaboatao-360` pelo caminho real do repositório.** O badge exibe **passing** (verde) depois que a pipeline rodar com sucesso na branch padrão (normalmente a `main`), ou seja, depois do primeiro merge.

### 7.2 Bloquear merge com testes falhando (opcional)
No GitHub: **Settings → Branches → Add branch protection rule** na `main` → marque **Require status checks to pass before merging** e selecione **Linter, testes e build**.

---

## 8. Limitações e próximos passos

- Os dados são demonstrativos e ficam só no navegador; não há login nem sincronização.
- Ainda não há testes de ponta a ponta (E2E) nem de cobertura mínima; podem entrar em uma próxima etapa.
- Quando o backend existir, trocar `dados.js` e o `useLocalStorage` por chamadas à API (já há `axios` instalado) e adicionar um job de testes do backend na pipeline.
- A pipeline usa `npm install`. Depois que o `package-lock.json` estiver atualizado e commitado, pode-se trocar por `npm ci`, que é mais rápido e reprodutível.

---

## 9. Redesign visual (identidade "Maré")

Esta etapa mudou **somente a aparência** das telas. Nenhuma lógica, rota, dado, texto de botão/rótulo consultado pelos testes ou chave do `localStorage` foi alterado.

### 9.1 Escopo

| Item | Situação |
|------|----------|
| Nova paleta, tipografia e formas | Aplicadas em todo o frontend |
| Navbar translúcida com menu para celular | Reescrita visualmente (mesmos links e rotas) |
| Início com hero animado (sol e ondas) e destaques em grade assimétrica | Refeito |
| Mapa, Roteiros, Comércio, Perfil e Sobre | Restilizados (estrutura e lógica intactas) |
| Testes, dados, hooks, rotas, CI e backend | Não alterados |

### 9.2 Identidade visual

- **Cores:** verde-maré `#12665d` (primária), espuma `#e6f3ef` (fundos suaves), sol `#f5b544` (acento pontual), tintas verde-acinzentadas para texto e bordas. O verde original foi mantido como base.
- **Tipografia:** Bricolage Grotesque (títulos) e Instrument Sans (texto), carregadas do Google Fonts em `index.html`. Sem conexão, o navegador usa a fonte do sistema.
- **Formas:** cantos arredondados (`1.5rem` nos cartões), bordas finas, sombras suaves apenas no hover.
- **Aviso de dados demonstrativos:** agora é uma pílula discreta com um ponto "sol", sem o emoji de alerta.
- **Ícones:** os emojis dos dados (`dados.js`) continuam; os emojis decorativos do cabeçalho e da Navbar foram trocados por SVG.

### 9.3 Animações

- **Início:** entrada em sequência dos títulos, subida do sol e ondas em movimento contínuo e lento.
- **Demais telas:** entrada suave e curta do conteúdo ao abrir a página.
- **Interações:** cor e sublinhado nos links da Navbar, botões que reagem ao clique, filtros, campos com foco destacado e ícone que se inclina no hover dos cartões.
- **Acessibilidade:** quem usa "reduzir movimento" no sistema não vê as animações; o foco do teclado é sempre visível.

### 9.4 Como o tema funciona

As cores `green`, `gray` e `yellow` do Tailwind foram **remapeadas** em `src/index.css` (bloco `@theme`). Por isso as classes já usadas nas telas assumem a nova paleta sem reescrever cada uma. Para ajustar a identidade, altere esse bloco.

Classes novas definidas no mesmo arquivo:

| Classe | Uso |
|--------|-----|
| `page`, `page-narrow`, `page-title`, `page-lead` | Contêiner, título e subtítulo das páginas |
| `notice` | Aviso de dados demonstrativos |
| `card`, `panel`, `tile`, `tag` | Cartões, painéis fixos, ícone do cartão e categoria |
| `btn` (`btn-sm`, `btn-lg`), `chip` (`chip-on`), `input` (`input-sm`) | Botões, filtros e campos |
| `avatar-btn` (`avatar-on`), `fav` | Escolha de avatar e botão de favorito |
| `nav`, `nav-link` | Navbar |
| `hero`, `ondas`, `dest` e derivadas | Tela inicial |

### 9.5 Arquivos alterados

```
frontend/
├── index.html                      (alterado — idioma pt-BR, título, fontes e cor do tema)
└── src/
    ├── index.css                   (alterado — tema, animações e classes visuais)
    ├── components/Navbar.jsx       (alterado — novo visual e menu para celular)
    └── pages/
        ├── Home.jsx                (alterado — hero e destaques; dados dos destaques mantidos)
        ├── Mapa.jsx                (alterado — apenas classes)
        ├── Roteiros.jsx            (alterado — apenas classes)
        ├── Comercio.jsx            (alterado — apenas classes e remoção do emoji do campo de busca)
        ├── Perfil.jsx              (alterado — apenas classes)
        └── Sobre.jsx               (alterado — apenas classes)
docs/DOCUMENTACAO.md                (este documento — seção 9 adicionada)
```

### 9.6 Compatibilidade com os testes

- O link ativo da Navbar continua com a classe `underline`, que o teste da Navbar consulta.
- Nomes de botões, rótulos, placeholders e títulos usados pelos testes foram preservados.
- O botão de menu da Navbar só aparece em telas pequenas e não duplica os links.
- **Pendente:** esta etapa foi entregue sem rodar a pipeline. Antes de abrir o Pull Request, execute `cd frontend && npm run lint && npm test && npm run build`.

### 9.7 Limitações

- A tela inicial usa `<a href="/mapa">` (como antes), que recarrega a página. Trocar por `Link` do React Router seria uma mudança de comportamento e ficou fora desta etapa.
- Os pontos de quebra (celular, tablet e desktop) foram pensados no código, mas ainda não foram conferidos em dispositivos reais.
