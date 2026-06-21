---
name: apex-frontend-nuxt
description: >-
  Convenções e scaffolding para frontends Nuxt 4 + TypeScript + Pinia + Nuxt UI.
  Use SEMPRE que estiver criando ou revisando código de frontend num projeto
  Nuxt — ao escrever um Pinia store, um composable, um resource HTTP, um
  formulário, um dialog/modal, tipos de entidade, ou ao montar a estrutura de
  pastas de um domínio novo (produtos, vendas, clientes, etc.). Também dispara
  ao revisar código frontend procurando stores gordos, uso de Proxy/valueObject,
  `$fetch` direto em componente, validação manual, ou estado de UI dentro do
  store. Vale mesmo quando o usuário não diz "store" ou "convenção"
  explicitamente — qualquer criação de feature de frontend Nuxt deve seguir
  estes padrões.
---

# Apex Frontend — Nuxt 4

Padrões para frontends **Nuxt 4 + TypeScript + Pinia + Nuxt UI**. Esta skill é o
guia canônico ao criar código novo e o checklist ao revisar. Ela é agnóstica de
projeto — os exemplos usam `Product`/`Sale` mas servem para qualquer domínio.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Nuxt 4 (diretório `app/`) |
| Linguagem | TypeScript (sem `any` em entidade/payload) |
| Estado | Pinia — **setup stores** (`defineStore('x', () => {...})`) |
| UI | Nuxt UI v4 |
| Validação | Zod + `UForm` |
| HTTP | `$fetch` nativo via `createResource<T>` |

## O princípio que governa tudo: store magro

O maior problema do código frontend é o store que vira um balde — começa com
estado, ganha cálculos, ganha lógica de serialização, ganha estado de dialog, e
em seis meses tem 400 linhas que ninguém entende. A regra que previne isso:

> **O store só guarda estado e sincroniza com o servidor.** Mais nada.

"Sincronizar com o servidor" = orquestrar o `createResource` (buscar, salvar,
deletar). Qualquer outra coisa que apareça num store é um sinal de que pertence a
outro lugar. Use esta tabela para decidir para onde mandar:

| Se você está prestes a colocar no store... | ...na verdade ele vai para |
|---|---|
| Cálculo ou valor derivado (`total`, `netTotal`, `finalPrice`) | um **composable de domínio** tipado que retorna `computed` → [references/composables.md](references/composables.md) |
| Montagem de payload / transformação da entidade pra API | uma **função pura tipada** `xToPayload(entity): XPayload` → [references/types.md](references/types.md) |
| Um sub-form aninhado (ex: item de venda dentro da venda) | um **store ou composable próprio** do sub-form → [references/stores.md](references/stores.md) |
| Estado de "dialog aberto/fechado" | o **sistema de overlay do Nuxt UI**, nunca o store → [references/dialogs.md](references/dialogs.md) |

**Regra de bolso:** se um store passa de ~150 linhas ou mistura mais de uma
dessas responsabilidades, pare e extraia. O número não é sagrado — é um alarme
para reavaliar, não um limite rígido.

### Por que isso importa

Um store magro é testável (você testa o cálculo sem montar um Pinia inteiro),
reusável (o mesmo `useSaleCalculations` serve na tela de venda e no relatório) e
legível (cabe na cabeça de uma vez). Quando a lógica de negócio mora em funções
puras e composables, ela não fica refém do ciclo de vida do componente nem do
store.

## Duas proibições explícitas

**1. Nada de `Proxy` / `valueObject`.** O padrão antigo de `new Proxy(entity,
{...})` com getters embutidos quebra a inferência de tipos do TypeScript (você
perde autocomplete justo na entidade mais importante) e reimplementa a
reatividade que o Vue 3 já dá de graça com `reactive`/`computed`. Substitua:
derivado → `computed` em composable; serialização → função pura. Detalhe em
[references/types.md](references/types.md).

**2. Nada de `$fetch` direto no componente.** Toda chamada de API passa pelo
resource, e o resource é orquestrado pelo store. O componente fala com o store,
o store fala com o resource, o resource fala com a API. Isso mantém endpoints
centralizados, tipados e fáceis de trocar. Detalhe em
[references/resource.md](references/resource.md).

## Como montar um domínio novo

Ao criar um domínio (`products`, `sales`, `customers`...), monte estas peças
nesta ordem. Cada uma tem um template pronto em `templates/` para copiar.

1. **Tipos** — `app/types/<domínio>.ts`: a interface da entidade e a do payload.
   Template: `templates/types.ts`. Guia: [references/types.md](references/types.md).
2. **Resource** — registre o endpoint com `createResource<Entidade>('/...')`.
   Template: `templates/resource.ts`. Guia: [references/resource.md](references/resource.md).
3. **Store de lista** — `app/stores/<domínio>/<entidade>.ts`: lista, filtros,
   paginação. Template: `templates/store.ts`. Guia: [references/stores.md](references/stores.md).
4. **Store de form** — `app/stores/<domínio>/<entidade>Form.ts`: item em edição,
   salvar. Template: `templates/storeForm.ts`. Guia: [references/stores.md](references/stores.md).
5. **Schema Zod** — `app/schemas/<domínio>.ts`: validação + tipo do form via
   `z.infer`. Template: `templates/schema.ts`. Guia: [references/forms.md](references/forms.md).
6. **Componentes** — `app/components/<domínio>/`: a lista e o form modal.
   Templates: `templates/List.vue`, `templates/FormModal.vue`. Guias:
   [references/forms.md](references/forms.md) e [references/dialogs.md](references/dialogs.md).

A estrutura completa de pastas do projeto está em
[references/structure.md](references/structure.md).

## Convenções de estilo

- **Setup stores sempre** — `defineStore('product', () => {...})`, nunca a
  Options API. Tipa melhor e alinha com `<script setup>`.
- **`<script setup lang="ts">` em todo componente.**
- **`storeToRefs`** para extrair estado reativo do store; ações são chamadas
  direto na instância.
- **Composables por domínio** — `composables/<domínio>/`, com `shared/` para os
  transversais (acl, format). Veja [references/composables.md](references/composables.md).
- **Sem injeção via plugin** para coisas que podem ser função pura — `format` e
  `calc` viram `utils/` (auto-importados); notificação é `useToast()` do Nuxt UI.
  Plugin só para boot real de app (init de SDK terceiro, error handler global).
- **Enums como `as const`** com tipo derivado, não array JS solto. Veja
  [references/structure.md](references/structure.md).
- **Nomes descritivos, sem abreviação** — `productVariant`, não `pv`.

## Checklist de revisão

Ao revisar código de frontend, procure estes desvios:

- [ ] Store com mais de ~150 linhas ou misturando responsabilidades → extrair
- [ ] Cálculo / valor derivado dentro do store → mover para composable
- [ ] Montagem de payload dentro do store → mover para função pura tipada
- [ ] `Proxy` ou `valueObject` → remover (composable + função pura)
- [ ] `$fetch` ou axios chamado direto no componente → passar pelo store/resource
- [ ] Estado de dialog (`isOpen`) no store → `useOverlay()` ou `v-model:open` local
- [ ] Entidade sem interface, ou `any` em payload → criar tipo em `types/`
- [ ] Validação manual de form (ifs, regras soltas) → schema Zod + `UForm`
- [ ] Plugin para algo que não é boot de app → mover para util/composable
- [ ] Enum como array solto sem tipo → `as const` + tipo derivado
