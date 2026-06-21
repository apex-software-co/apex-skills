---
name: apex-comercio-brand
description: Use ao trabalhar com a identidade da marca Apex Comércio — cores e tokens (verde primário #02B25F), tipografia (Montserrat), logos light/dark, paleta de gráfico, design language (rounded lg, flat) e voz/tom da marca (pt-BR, próximo do comerciante). É a fonte da verdade dos valores por trás dos tokens de tema, para UI, e-mail, deck, social ou qualquer peça da marca. Para comportamento de UI (loading, estados, dialogs) use apex-ui-ux; aqui ficam os valores concretos da marca.
---

# apex-comercio-brand

A **marca Apex Comércio** num arquivo só. É a **fonte da verdade dos valores** —
cor, fonte, logo, voz. A `apex-ui-ux` diz a _regra_ ("nunca hardcode cor, use
token"); esta skill dá os **valores por trás do token**. Use ao construir UI Apex,
um e-mail, um deck, um post — qualquer coisa que vista a marca.

> Esta skill descreve **só a Apex Comércio**. O sistema roda multi-marca e `primary`
> vem de uma config por env (`brandConfigs.js`) — trocar de marca é trocar a config,
> nunca mexer no componente. Os valores abaixo são os da Apex.

## Essência

- **Produto:** Apex Comércio. **Empresa:** Apex Software (marca **▲** verde).
- **Para quem:** comerciante brasileiro (pequeno e médio varejo).
- **O que é:** sistema completo de gestão para o comércio — vendas, estoque, caixa,
  NF-e e catálogo online em uma só plataforma.
- **Promessa:** _vender mais e se preocupar menos._

## Cor

A marca é **verde**. `primary` **é** a cor da marca — e aqui `success` usa o **mesmo
verde** de propósito (a ação principal e o "deu certo" são a mesma energia).

| Token | Light | Dark | Uso |
|---|---|---|---|
| `primary` | `#02B25F` | `#02B25F` | **a cor da marca** — ação principal, CTA, destaque |
| `success` | `#02B25F` | `#02B25F` | feedback de sucesso (= primary, proposital) |
| `secondary` | `#2c3d8f` | `#2c3d8f` | apoio (índigo) |
| `info` | `#00ACC1` | `#0057d9` | informativo |
| `error` | `#F44336` | `#F44336` | erro / ação destrutiva |
| `background` | `#ffffff` | `#111827` | fundo da página |
| `surface` | `#f6f6f6` | `#1F2937` | card, superfície elevada |
| `drawer` | `#f6f6f6` | `#1F2937` | menu lateral (= surface) |

Verde primário em hex pra peças fora do app (e-mail, social, deck): **`#02B25F`**.

**Paleta de gráfico** (sai da config de marca, nunca hardcoded no componente do gráfico):

```
#007d51   #00391e   #02B25F   #045d56   #37efba   #c7f464
```

## Tipografia

- **Montserrat** — em tudo (corpo, títulos, botões).
- Pesos em uso: 200 (leve), 500 (médio), itálico 400.
- Google Fonts:
  `https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,500;1,400&display=swap`
- Fallback: `sans-serif`.

## Logo & favicon

| Asset | Caminho | Quando |
|---|---|---|
| Logo (tema claro) | `/images/logo/logo_light.png` | fundo claro |
| Logo (tema escuro) | `/images/logo/logo_dark.png` | fundo escuro |
| Logo de auth/login | `/images/app/image3.png` | telas de entrada |
| Favicon | `/favicon.ico` | aba/PWA |

A escolha light/dark segue o tema atual — não fixe um logo no componente; deixe a
config resolver. **▲ Apex** (triângulo verde) é o sinal curto da empresa; o logo
completo é a assinatura do produto.

## Design language — o "jeito Apex"

Visual **limpo, arredondado e flat**. Padrões que aparecem em todo lugar:

- **Cantos `rounded: lg`** — botões, inputs, cards, tabelas, dialogs.
- **Flat: `elevation: 0`** — sem sombra pesada; profundidade vem da `surface`.
- **Inputs `variant: solo-filled`, `flat`** — campo preenchido, sem borda dura.
- Fonte aplicada globalmente (Montserrat) inclusive em dialog/overlay.
- Ícones: hoje FontAwesome + MDI no Vuetify; **destino é hugeicons** (ver
  `apex-ui-ux`) — não introduza um sistema novo de ícone.

## Voz & mensagem

- **Idioma:** português do Brasil, sempre.
- **Tom:** próximo do comerciante, claro e prático. Sem jargão técnico — fala de
  _benefício_ ("vender mais", "menos preocupação"), não de feature interna.
- **Postura:** parceiro do lojista, não fornecedor distante. Direto, caloroso, sem
  ser informal demais.
- **Nome:** sempre **Apex Comércio** (não "Apex POS", não "o sistema"). A empresa é
  **Apex Software**.
- **Emojis:** com moderação (alguns, não em todo fim de frase) — alinhado à
  `release-notes`.

Linhas de posicionamento aprovadas (reuse, não reinvente):

> Sistema completo de gestão para o comércio brasileiro. Vendas, estoque, caixa,
> NF-e e catálogo online em uma só plataforma.

> Um sistema de gestão completo para você vender mais, e se preocupar menos.

## Regra de ouro

**Nenhuma cor literal no componente.** Sempre o token (`primary`, `success`, …);
os hex desta skill são a referência da marca, não pra colar no código. Cor nova
entra na **config de marca**, não no componente. (Detalhe da regra: `apex-ui-ux` →
`references/tema.md`.)

## Checklist

- [ ] `primary`/CTA usa o verde da marca (`#02B25F`) **via token**, não hex no componente?
- [ ] `success` é o mesmo verde do `primary`? `error` é `#F44336`?
- [ ] Fonte é **Montserrat** (com fallback `sans-serif`)?
- [ ] Logo respeita light/dark pela config (não fixo no componente)?
- [ ] Cantos `rounded lg` e visual flat (`elevation 0`)?
- [ ] Cor de gráfico veio da paleta da marca, não hardcoded?
- [ ] Texto em pt-BR, tom de comerciante, foco em benefício, sem jargão?
- [ ] Nome escrito **Apex Comércio** / empresa **Apex Software**?

## Relacionadas

- **`apex-ui-ux`** — comportamento de UI (estados, loading, dialogs, hierarquia de
  botões) e a regra de tema sem hardcode.
- **`apex-frontend-nuxt`** — implementação (stores, HTTP, forms, onde a config de
  marca é lida).
- **`apex-statusline`** — usa a marca **▲ Apex Software** (verde) na statusline.
