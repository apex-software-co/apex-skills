# Tema — cor, marca, dark mode

## Zero cor hardcoded

A regra única e inegociável: **nunca uma cor literal no componente.** Sempre um
**token de tema**.

| Em vez de | Use |
|---|---|
| `#02B25F`, `color: green`, `style="background:#fff"` | `primary` |
| `#F44336`, vermelho literal | `error` |
| verde de sucesso literal | `success` |
| cinza de card literal | `surface` |
| branco/preto de fundo | `background` |

Tokens canônicos: `primary` · `secondary` · `success` · `error` · `info` ·
`background` · `surface` (e derivados de drawer/header). Cor de gráfico vem da
config de marca, não hardcoded no componente do gráfico.

Por quê: cor literal quebra dark mode, quebra multi-brand e espalha decisão de
design pelo código. Um token resolve nos três.

## Marca centralizada (multi-brand)

- A marca (cores, fonte, logos, ícones, paleta de gráfico) vive em **uma config
  central** (ex.: `brandConfigs.js`), selecionada por **variável de ambiente** — o
  mesmo build vira marcas diferentes (ex.: `apex_comercio` vs `clarity`).
- `primary` **é a cor da marca**. Trocar de marca = trocar a config, não mexer em
  componente.
- Logos e ícones por marca (light/dark/favicon) também saem da config.

## Dark mode

- Suportado e **persistido** (localStorage) via a API de tema da lib — não via CSS
  literal nem classe manual de cor.
- Como tudo usa token, dark mode "só funciona": cada token tem seu valor claro/escuro
  na config. Se algo não troca no dark, quase sempre é uma **cor hardcoded** escapando
  — corrija trocando pelo token.

## Checklist rápido de tema

- [ ] Nenhuma cor literal (`#...`, nomes de cor) em componente?
- [ ] `primary` usado pra ação principal, `error`/`success` pra feedback?
- [ ] Cores novas entram na config de marca, não no componente?
- [ ] Testado em dark mode (nada "some" nem fica ilegível)?
