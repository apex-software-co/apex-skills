# Cards & superfícies — quando agrupar, quando não aninhar

## Regra central — um nível de superfície

A marca é **flat** (`elevation: 0`); profundidade vem **só** da troca de cor
`background` → `surface`, não de sombra (ver `apex-comercio-brand`). Logo só
existem **dois níveis visuais**:

**fundo da página (`background`) · um card (`surface`)**

Card dentro de card = `surface` dentro de `surface` = dois cinzas grudados sem
sombra que os separe → vira sopa, e a hierarquia some. **Não aninhe card em card.**

## Card é ferramenta de agrupamento, não decoração

Antes de criar um card, pergunte: *este conteúdo é uma unidade autônoma que
precisa se destacar do entorno?* Se for "só um pedaço da mesma seção", **não é
card** — é espaçamento + título.

| Situação | Use |
|---|---|
| Agrupar uma unidade autônoma (um registro, um KPI, o form de uma entidade) | **Card** (`surface`) |
| Separar seções **dentro** de um card | **Título + `space-y`** ou **`USeparator`** — não outro card |
| Lista de itens dentro de um card | **Linhas com divisor/hover** — não um card por item |
| Dar respiro entre blocos da página | **`space-y` no container** (ver [`espacamento.md`](espacamento.md)) — não embrulhar cada bloco num card |

## Quando você acha que precisa de card dentro de card

Quase sempre é um destes — e nenhum pede um segundo `surface`:

- **Seções internas** → heading (`text-lg font-semibold`) + `space-y-6`.
- **Divisão visual** → `USeparator` ou borda sutil — não preenchimento.
- **Sub-item interativo** (linha selecionável, item de lista) → **borda + estado
  de hover/active**, não card preenchido.
- **Grupo de campos no form** → fieldset com label de seção + `space-y-4`.

## Exceções (não são aninhamento)

- **Cards irmãos**: dashboard com vários cards lado a lado num `grid gap-4` —
  estão **lado a lado**, não um dentro do outro. Ok.
- **Controle não é card**: um input `solo-filled` (já é uma surface mais clara)
  dentro de um card é um **controle**, não aninhamento. Idem chip, badge, avatar.
- **POS / painéis**: dividir um painel em sub-painéis → use **borda/coluna**, não
  cards preenchidos empilhados.

Buscar mais profundidade com sombra **não** é o caminho: a marca é flat. Se dois
níveis não bastam pra hierarquia, o problema é a **estrutura da tela**, não falta
de mais um card — reveja seções, espaçamento e títulos antes.

## Checklist rápido de cards

- [ ] Nenhum card preenchido (`surface`) dentro de outro card?
- [ ] Card agrupa uma **unidade autônoma**, não decora cada bloco?
- [ ] Seções internas com **título + `space-y`/divisor**, não sub-card?
- [ ] Itens de lista com **divisor/hover**, não um card por item?
- [ ] Cards múltiplos são **irmãos** (grid), não aninhados?
