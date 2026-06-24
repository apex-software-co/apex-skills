# Tipografia — escala de tamanho e peso

## Regra central — vocabulário curto e por papel

Mesmo problema do espaçamento: sem regra, cada tela ganha um `text-[17px]` e um
peso diferente. O padrão Apex **restringe** tamanho e peso a poucos degraus, cada
um com um **papel fixo**. Tamanho e peso são decisão de hierarquia — não estética
solta de cada componente.

A **fonte** vem da marca (Montserrat) — ver `apex-comercio-brand`. Aqui ficam a
**escala de tamanho** e o **vocabulário de peso** de UI de app.

## Escala de tamanho (Tailwind `text-*`)

| Degrau | px | Papel | Peso típico |
|---|---|---|---|
| `text-xs` | 12px | caption, hint, helper de form, badge | `400` / `500` em badge |
| `text-sm` | 14px | corpo denso: tabela, form, listas | `400` |
| `text-base` | 16px | corpo padrão / texto de leitura | `400` |
| `text-lg` | 18px | título de seção / card | `600` |
| `text-xl` | 20px | título de página (header) | `600` |
| `text-2xl` | 24px | número de destaque, hero de dashboard | `600` |
| `text-4xl` | 36px | display grande: total do POS/caixa, valor em destaque | `600` |

**Não use** outros degraus (`text-md` inexistente, `3xl`, `5xl+`) nem valores
arbitrários (`text-[17px]`). O salto de `xl` direto pra `2xl`/`4xl` é proposital:
texto comum mora em `xs`–`xl`; `2xl`/`4xl` são só pra **número em destaque**.

## Vocabulário de peso — só três

| Peso | Classe | Onde |
|---|---|---|
| **Regular 400** | `font-normal` | corpo, células de tabela, a maioria do texto |
| **Medium 500** | `font-medium` | label de campo, header de coluna, item ativo, ênfase leve, texto de botão |
| **Semibold 600** | `font-semibold` | títulos (seção, página), número de destaque |

**Proibido:** `200`, `300`, `700`, `800`, `900`, peso arbitrário (`font-[450]`) e
**itálico em UI**. O `200/500` e o itálico que a marca cita são pra **peça de
marca** (logo lockup, deck, social) — não pra tela de app, onde `400` lê melhor em
densidade. Negrito de ênfase = subir o **peso** (`font-medium`/`semibold`), nunca
um tamanho a mais.

## Pareamento tamanho × peso (a hierarquia pronta)

| Elemento | Tamanho | Peso |
|---|---|---|
| Título de página (header) | `text-xl` | `font-semibold` |
| Título de seção / card | `text-lg` | `font-semibold` |
| Label de campo / header de coluna | `text-sm` | `font-medium` |
| Corpo / valor de campo / célula | `text-sm`–`text-base` | `font-normal` |
| Texto de botão | `text-sm`–`text-base` | `font-medium` |
| Caption / hint / helper | `text-xs` | `font-normal` |
| Número de destaque (KPI dashboard) | `text-2xl` | `font-semibold` |
| Total/valor grande (POS, pagamento) | `text-4xl` | `font-semibold` |

Hierarquia se faz com **dois eixos** (tamanho + peso), não com cinco tamanhos.
Dois níveis de título por tela bastam (página → seção); abaixo disso, peso resolve.

## Cor e line-height

- **Cor sempre por token** — `text-default` / `text-muted` (secundário) etc.,
  nunca cor literal. Ver [`tema.md`](tema.md).
- **Line-height**: deixe o default do Tailwind por tamanho. Só ajuste em extremos —
  título grande mais junto (`leading-tight`), bloco de leitura mais solto
  (`leading-relaxed`). Não fixe `leading-[N]` arbitrário.

## Mobile x desktop

- **Corpo não muda** de tamanho por breakpoint — `text-sm`/`base` valem nos dois.
- **Só títulos/display** podem descer um degrau no mobile pra não estourar a
  largura: `text-2xl md:text-4xl`, `text-lg md:text-xl`. Mesmo check de breakpoint
  de `telas.md` — não invente um novo.

## Densidade por arquétipo

- **POS / caixa** e **relatório (print)** → corpo em `text-sm` (denso). POS usa
  `text-4xl` só no total da operação.
- **Dashboard / hero** → `text-2xl`/`4xl` nos números-chave; o resto segue a escala.
- **Lista / form** → corpo `text-sm`, títulos `text-lg`/`xl`.

## Checklist rápido de tipografia

- [ ] Só degraus da escala (`xs,sm,base,lg,xl,2xl,4xl`) — nenhum `text-[..]`?
- [ ] Só três pesos (`400/500/600`) — nada de `200/300/700+` nem itálico em UI?
- [ ] Hierarquia por tamanho **e** peso, no máx. dois níveis de título por tela?
- [ ] Ênfase feita com peso, não com um tamanho a mais?
- [ ] Cor do texto por token (`text-default`/`text-muted`), nunca literal?
- [ ] Só títulos/display mudam no breakpoint; corpo fixo?
