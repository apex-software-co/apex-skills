---
name: apex-ui-ux
description: Use ao construir ou revisar UI/UX em projetos frontend Apex (Nuxt) — decidir estados de loading/skeleton, estado vazio e de erro; escolher arquétipo de tela (lista, form em modal vs página, dashboard, POS/caixa, relatório); definir hierarquia e posição de botões; dialogs e confirmação de ação destrutiva; toasts/feedback; forms; tabelas; tema/cores. Agnóstica de biblioteca (Vuetify hoje, Nuxt UI no destino) — descreve comportamento de UX, não API de componente.
---

# apex-ui-ux

Padrões de **UI/UX** dos projetos frontend da Apex. Fala de **comportamento** —
não de API de Vuetify ou Nuxt UI. Para estrutura de pastas, stores, camada HTTP,
forms com Zod e overlay de dialog no nível de **implementação**, use a skill
relacionada **`apex-frontend-nuxt`**.

## Princípio central — UI é composição de estados explícitos

Toda tela ou lista trata **4 estados**, e nenhum fica implícito:

**carregando · vazio · erro · conteúdo**

Em cima disso, duas decisões: escolher o **arquétipo de tela** certo e usar um
**vocabulário fixo de ação e feedback**. Esta skill é **opinativa**: descreve o
padrão-alvo. Onde o código atual diverge, há notas de _débito conhecido_ nas
referências — siga o alvo, não o legado.

## Quando usar

- Criando uma tela/página nova (lista, form, dashboard, fluxo).
- Adicionando uma ação (botão, dialog, confirmação, toast).
- Revisando UI: "isso segue nossos padrões?".
- Decidindo loading, estado vazio, tratamento de erro.

Não use para: lógica de negócio, estrutura de store/HTTP (→ `apex-frontend-nuxt`),
APIs específicas de uma lib de componente.

## Árvores de decisão

**Qual loading usar?**

| Situação | Mecanismo |
|---|---|
| Carga inicial de lista/tela | **Skeleton** que imita o layout final (substitui o conteúdo) |
| Mutação/ação que bloqueia a tela (salvar, excluir, sincronizar) | **Overlay global bloqueante** (`useLoading`) |
| Ação localizada num botão | **Loading no próprio botão** |

**Onde o form mora?**

| Tamanho | Container |
|---|---|
| `< 5` campos | Modal pequeno |
| `5–15` campos | Modal médio (fullscreen no mobile) |
| `15+` campos ou multi-seção | Página dedicada / tabs |

**Precisa confirmar a ação?**

| Ação | Padrão |
|---|---|
| Destrutiva / irreversível (excluir, cancelar venda) | **ConfirmDialog** (Promise) antes de executar |
| Resto | Ação direta + toast de sucesso |

**Como dar feedback?**

| Evento | Canal |
|---|---|
| Sucesso | **Toast curto** |
| Erro de request (HTTP) | **Handler global** — o componente _não_ trata |
| Erro de validação | **Inline no campo** |

## Hierarquia e posição de botões

- **Um único CTA primário** por contexto (a ação principal: salvar/confirmar).
- **Confirmar à direita, cancelar à esquerda** (`justify-end` no rodapé).
- Intenção define o estilo: primário = ação principal; discreto/plain =
  cancelar/fechar/voltar; destrutivo = discreto **e** confirmado; "novo/adicionar"
  = primário com ícone `+`.
- Ações de linha em tabela → botão-ícone abrindo menu de 3-pontinhos.

## Vocabulário de estados — onde cada estado mora

| Estado | Mecanismo | Onde mora |
|---|---|---|
| Carregando (inicial) | Skeleton, gated por `isBooted` | Flag local da view (nome único) |
| Carregando (mutação) | Overlay global | Store de loading via `useLoading` |
| Vazio | Componente "marcado" (ícone+texto) + CTA quando acionável | Render condicional na lista |
| Erro (request) | Toast global | Handler central (nunca no componente) |
| Erro (validação) | Mensagem inline no campo | No form |
| Conteúdo | Tabela (desktop) / lista (mobile) | View |

## Checklist de revisão

- [ ] Os 4 estados (carregando/vazio/erro/conteúdo) estão todos tratados?
- [ ] Carga inicial usa **skeleton**, não spinner central?
- [ ] Mutação usa loading bloqueante via `useLoading` com `try/finally`?
- [ ] Estado vazio é "marcado" e distingue _vazio por filtro_ de _nunca criou_ (onboarding com CTA)?
- [ ] Erro de request fica no **handler global** (componente não trata)?
- [ ] Erro de validação aparece **inline no campo**?
- [ ] Ação destrutiva passa por **ConfirmDialog**?
- [ ] Botões: **1 CTA primário**, confirmar à direita / cancelar à esquerda?
- [ ] Form no container certo (modal pequeno / médio fullscreen mobile / página)?
- [ ] Lista segue a anatomia (filtros → resumo → tabela/lista → paginação)?
- [ ] Espaçamento só nos degraus permitidos, ritmo via `gap`/`space-y` no container?
- [ ] Tipografia só na escala (xs–xl, 2xl/4xl) e em 3 pesos (400/500/600)?
- [ ] Ícone via sistema único (hugeicons), sem `mdi` novo?
- [ ] **Zero cor hardcoded** — usa token de tema?
- [ ] Responsivo: table↔list, dialog fullscreen mobile, ações via teleport?
- [ ] Feedback de sucesso por **toast único**?
- [ ] Estado de dialog **fora do store**?

## Referências

- [`references/estados.md`](references/estados.md) — loading, vazio, erro, feedback, confirmação, wait-for-response.
- [`references/telas.md`](references/telas.md) — arquétipos de tela, app shell, anatomia de lista, responsivo.
- [`references/controles.md`](references/controles.md) — botões, ícones, dialogs, forms, tabelas.
- [`references/tema.md`](references/tema.md) — cor/marca centralizada, dark mode, multi-brand.
- [`references/espacamento.md`](references/espacamento.md) — escala de spacing, gaps, ritmo das views, densidade por arquétipo.
- [`references/tipografia.md`](references/tipografia.md) — escala de tamanho e peso, pareamento, hierarquia, densidade por arquétipo.
