# Espaçamento — escala, gaps, ritmo das views

## Regra central — vocabulário curto e semântico

A base é a **escala padrão do Tailwind** (1 unidade = `4px`). Mas usar todos os
degraus vira caos: ninguém sabe se "entre campos" é `gap-3`, `gap-4` ou `gap-5`.

Então o padrão Apex **restringe** o vocabulário a poucos degraus, cada um com um
**papel fixo**. Espaçamento é decisão de design — não escolha de número solto.

**Degraus permitidos** (Tailwind → px):

| Degrau | px | Papel |
|---|---|---|
| `1` | 4px | colar elementos quase juntos (ícone + label, dentro de um chip) |
| `2` | 8px | itens de um mesmo grupo (botões de ação, ícone + texto) |
| `3` | 12px | densidade média (linhas de tabela, listas compactas) |
| `4` | 16px | **passo padrão** — entre campos de form, gutter de grid |
| `6` | 24px | entre seções dentro de um card / bloco |
| `8` | 32px | entre blocos grandes da página, padding de página desktop |
| `12` | 48px | respiro de topo/seção em telas arejadas (raro) |

**Não use** `5`, `7`, `9`, `10`, `11` nem valores arbitrários (`gap-[18px]`). Se
"não encaixou", quase sempre é o **layout** que está errado, não o número.

## Onde cada degrau mora

| Contexto | Espaçamento | Classe típica | Muda no breakpoint? |
|---|---|---|---|
| Ícone + label, conteúdo de um chip/badge | `1`–`2` | `gap-1` / `gap-2` | Não |
| Botões de um grupo de ação (Cancelar / Salvar) | `2` | `flex justify-end gap-2` | Não |
| Campos de um form (ritmo vertical) | `4` | `space-y-4` | Não |
| Gutter de grid (cards de resumo, galeria) | `4` | `grid gap-4` | Não |
| Seções dentro de um card | `6` | `space-y-6` | Não |
| Blocos da página (filtros → resumo → tabela) | `6`→`8` | `space-y-6 md:space-y-8` | **Sim** |
| Padding interno de card / surface | `4`→`6` | `p-4 md:p-6` | **Sim** |
| Padding do container de página | `4`→`6`/`8` | `p-4 md:p-6` / `md:p-8` | **Sim** |

> **Regra do breakpoint:** mudam só os espaços **estruturais** (padding de
> container, ritmo entre blocos) — mobile aperta, desktop areja. Os gaps
> **internos** (relação entre elementos já juntos: botões, campos, ícone+label)
> ficam **fixos**; encolher ali só piora toque e legibilidade.

> Os exemplos batem com os templates: `FormModal.vue` usa `gap-2` no rodapé de
> ações; `List.vue` usa `space-y-4` no corpo. Mantenha essa convenção.

## Ritmo das views (espaçamento entre seções)

Use **`gap` / `space-y` no container**, não `margin` solta em cada filho. Margem
acumula, vaza e quebra quando um item some (estado vazio/condicional); `gap` no
pai resolve sozinho.

A anatomia de lista (ver [`telas.md`](telas.md)) espaça assim, de cima pra baixo:

```
Header de página
  ↓ (header é parte do app shell, não conta no space-y do corpo)
Corpo da view  →  space-y-6 (md: space-y-8)
  ├─ Barra de filtros
  ├─ Cards de resumo        (grid gap-4 entre os cards)
  ├─ Tabs de status
  ├─ Conteúdo (tabela/lista)
  └─ Paginação
```

- **Um nível de `space-y` por container.** Não aninhe `space-y-6` dentro de
  `space-y-6` esperando somar — reestruture em sub-blocos com papel claro.
- **Form**: campos com `space-y-4`; se houver seções (ex.: "Dados" / "Endereço"),
  `space-y-6` entre seções e `space-y-4` dentro de cada uma.

## Densidade por arquétipo

Espaçamento não é fixo — **acompanha a densidade que o arquétipo pede**:

| Arquétipo | Densidade | Ajuste |
|---|---|---|
| Lista / form / dashboard | Padrão | escala acima como está |
| **POS / caixa** | **Densa** | desça um degrau (`gap-2`/`gap-3`); operador quer tudo à mão, sem rolar |
| **Relatório (print)** | **Compacta** | mínimo necessário pra caber na folha (térmico/A4); padding de página vira margem de impressão |
| Onboarding / tela vazia / hero | **Arejada** | suba um degrau (`gap-6`/`gap-8`/`12`) pra dar foco |

## Mobile x desktop

Quem muda no breakpoint está marcado na coluna **"Muda no breakpoint?"** acima —
só os espaços estruturais (padding de container, ritmo entre blocos). Além disso:

- **Não invente breakpoint** pra espaçamento — use o mobile padrão do projeto
  (mesmo check de `telas.md`).

## Checklist rápido de espaçamento

- [ ] Só degraus permitidos (`1,2,3,4,6,8,12`) — nenhum valor arbitrário?
- [ ] Ritmo entre seções via `gap`/`space-y` no **container**, não `margin` por filho?
- [ ] Um nível de `space-y` por container (sem aninhar esperando somar)?
- [ ] Campos de form em `space-y-4`; seções em `space-y-6`?
- [ ] Botões de ação em `gap-2`?
- [ ] Padding sobe no desktop (`p-4 md:p-6`)?
- [ ] Densidade ajustada ao arquétipo (POS denso, relatório compacto, onboarding arejado)?
