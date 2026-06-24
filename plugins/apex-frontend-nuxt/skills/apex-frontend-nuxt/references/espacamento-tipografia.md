# Espaçamento & tipografia — classes permitidas

A **regra e o porquê** (papéis, ritmo, densidade por arquétipo) vivem na skill
`apex-ui-ux` → `espacamento.md` e `tipografia.md`. Aqui ficam as **classes
Tailwind concretas** que materializam essa regra em componente Nuxt. Use só estas.

## Espaçamento

Base: escala padrão do Tailwind (1 = `4px`). Degraus permitidos: `1,2,3,4,6,8,12`.

| Contexto | Classe | Muda no breakpoint? |
|---|---|---|
| Ícone + label, conteúdo de chip | `gap-1` / `gap-2` | Não |
| Botões de um grupo de ação | `flex justify-end gap-2` | Não |
| Campos de form (ritmo vertical) | `space-y-4` | Não |
| Gutter de grid (cards de resumo) | `grid gap-4` | Não |
| Seções dentro de um card | `space-y-6` | Não |
| Blocos da página (filtros → resumo → tabela) | `space-y-6 md:space-y-8` | **Sim** |
| Padding de card / surface | `p-4 md:p-6` | **Sim** |
| Padding do container de página | `p-4 md:p-6` (`md:p-8`) | **Sim** |

- **Ritmo via `gap`/`space-y` no container** — nunca `margin` por filho (vaza e
  quebra quando um item some no v-if).
- Nada de valor arbitrário (`gap-[18px]`, `p-[10px]`).

## Tipografia

Fonte (Montserrat) vem da config de marca — não fixe `font-family` no componente.

**Tamanhos** (`text-*`): `xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24) 4xl(36)`.
**Pesos** (3 só): `font-normal(400) · font-medium(500) · font-semibold(600)`.

| Elemento | Classe |
|---|---|
| Título de página | `text-xl font-semibold` (`text-2xl md:` em hero) |
| Título de seção / card | `text-lg font-semibold` |
| Label de campo / header de coluna | `text-sm font-medium` |
| Corpo / célula / valor | `text-sm` ou `text-base` (`font-normal`) |
| Texto de botão | `text-sm font-medium` |
| Caption / hint / helper | `text-xs` |
| KPI / número de destaque | `text-2xl font-semibold` |
| Total grande (POS, pagamento) | `text-4xl font-semibold` |

- **Proibido:** `text-[17px]`, `font-bold`/`font-light`/`200`/`700`, itálico em UI.
- **Ênfase = subir peso**, não tamanho. Hierarquia com no máx. dois níveis de título.
- **Cor do texto por token de tema** (`text-default`/`text-muted`), nunca literal —
  ver `apex-ui-ux` → `tema.md`.
- **Corpo não muda** no breakpoint; só título/display pode descer um degrau no mobile.

## Onde isso bate nos templates

`templates/FormModal.vue` usa `gap-2` no rodapé de ações; `templates/List.vue` usa
`space-y-4` no corpo. Ao criar telas novas, siga as tabelas acima.
