# Telas — arquétipos, app shell, anatomia de lista, responsivo

## App shell (a moldura comum)

Quase toda tela vive dentro de uma moldura comum:

- **Sidebar de navegação** — filtrada por **permissão (ACL)** + **feature flag**.
  Itens que o usuário não pode ver simplesmente não renderizam.
- **Header de página** — título + ações da página (botões "Novo", "Relatórios",
  "Opções"). É o ponto canônico do título; não repita títulos soltos no corpo.
- **Barras mobile via teleport** — no mobile as ações migram pra barras do app
  (topo e rodapé) usando _teleport_ (ex.: `#appBarAppend`, `#appBottomBar`).
  A tela "envia" seus botões pra essas barras em vez de duplicar layout.

## Arquétipos de tela (quando usar cada)

| Arquétipo | Quando | Notas |
|---|---|---|
| **Lista / index** | Listar/filtrar registros de um domínio | O mais comum — ver "anatomia" abaixo |
| **Form em modal** | Criar/editar registro simples ou médio | `< 15` campos; fullscreen no mobile |
| **Form em página** | Criar/editar registro grande/multi-seção | `15+` campos, tabs, ou fluxo dedicado (ex.: venda) |
| **Dashboard** | Visão geral / início | Cards + gráficos; mistura operacional + conteúdo por tier/role |
| **POS / caixa** | Operação de venda/caixa | **Layout próprio**, chrome mínimo, view dirigida por estado |
| **Relatório (print)** | Impressão/exportação | Tema claro forçado, UI escondida, tamanhos térmico/A4 |
| **Wizard / onboarding** | Fluxo guiado multi-etapa | Stepper + validação por etapa |
| **Configurações** | Ajustes | Navegação por lista aninhada |

## Anatomia da lista (o arquétipo mais repetido)

De cima pra baixo, na ordem:

1. **Header de página** — título + ações (Novo, Relatórios, Opções).
2. **Barra de filtros** — busca + seletor de período + filtro do domínio.
3. **Cards de resumo** (quando aplicável / admin) — totais, contagens, ticket médio.
4. **Tabs de status** (quando aplicável) — ex.: Todas / Pendentes / Canceladas.
5. **Conteúdo responsivo** — **tabela** no desktop, **lista** no mobile.
6. **Paginação** — componente próprio (sem footer nativo de tabela).
7. **Totais no rodapé mobile** — fixos na barra inferior via teleport.

Os estados (skeleton → vazio → erro → conteúdo) ficam **dentro** dessa estrutura —
ver `estados.md`. A paginação orquestra skeleton/vazio automaticamente.

## Responsivo

- **Breakpoint mobile** é o check primário (não invente breakpoints ad-hoc).
- **Tabela ↔ lista**: no mobile a tabela vira lista (geralmente agrupada por data),
  não uma tabela com scroll horizontal.
- **Dialog → fullscreen** no mobile.
- **Ações → teleport** pras barras mobile (topo/rodapé), em vez de empilhar no corpo.

## Exceções intencionais (não são inconsistência)

- **POS / caixa** usa layout próprio (sem o header padrão, chrome mínimo) porque a
  UX de operador pede foco total na operação. View dirigida por estado (turno
  aberto vs fechado).
- **Relatório** força tema claro e esconde a UI de navegação porque o alvo é a folha
  impressa (térmico/A4).

Documente desvios assim — como decisão deliberada do arquétipo, não como "fora do
padrão".
