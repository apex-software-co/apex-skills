# Dialogs e modais

Estado de "dialog aberto/fechado" é estado de UI, não de domínio — então **nunca
vive no store** (botar lá é exatamente o que volta a inchar o store). O Nuxt UI
oferece dois caminhos; escolha pelo número de lugares que abrem o dialog.

| Caso | Padrão |
|---|---|
| Form reutilizado, aberto de vários pontos (regra geral) | `useOverlay()` programático |
| Dialog amarrado a um único lugar (confirmação inline) | `v-model:open` local |
| Estado de dialog no store | **evitar** |

## Caso geral: `useOverlay()` programático

Forms costumam ser reutilizados e abertos de muitos lugares (lista, menu de
ação, atalho, outro dialog). O overlay programático resolve isso sem
prop-drilling e sem instanciar o `<Modal>` em cada template: o componente do form
declara as props que recebe e o resultado que devolve, e qualquer caller o abre
imperativamente.

O `useOverlay()` é provido pelo `<UApp>` (por isso ele é obrigatório na raiz).

```ts
// em qualquer lugar que precise abrir o form
import ProductFormModal from '~/components/products/ProductFormModal.vue'

const overlay = useOverlay()
const productForm = overlay.create(ProductFormModal)

async function editProduct(product: Product) {
  const formStore = useProductFormStore()
  await formStore.load(product.id!)

  const saved = await productForm.open({ product }).result   // ◄ awaitable
  if (saved) await productStore.fetchAll()                   // refaz a lista
}

async function newProduct() {
  useProductFormStore().reset()
  const saved = await productForm.open({}).result
  if (saved) await productStore.fetchAll()
}
```

O componente do modal recebe as props e fecha devolvendo o resultado:

```vue
<!-- app/components/products/ProductFormModal.vue -->
<script setup lang="ts">
const props = defineProps<{ product?: Product }>()
const emit = defineEmits<{ close: [saved: boolean] }>()
// ...UForm aqui (ver forms.md); ao salvar: emit('close', true)
</script>

<template>
  <UModal :title="props.product ? 'Editar produto' : 'Novo produto'">
    <template #body>
      <!-- UForm -->
    </template>
  </UModal>
</template>
```

Por que isso ganha das alternativas:

- **Reutilizado de N lugares sem dor** — cada caller faz `.open(props)`. Sem
  `v-model:open` repetido, sem prop-drilling, sem `<Modal>` em cada pai.
- **Store continua magro** — o aberto/fechado mora no sistema de overlay, não no
  store.
- **Type-safe nas duas pontas** — `.open({ product })` checa as props na entrada;
  `.result` é tipado na saída (`saved: boolean`, ou a entidade criada).
- **Awaitable** — o caller decide o que fazer depois (refazer lista, abrir o
  próximo dialog) sem event bus nem watcher.

## Caso inline: `v-model:open` local

Quando o dialog pertence a um único lugar — uma confirmação de exclusão dentro de
uma página específica — não precisa de overlay programático. Um `ref` local
declarativo basta:

```vue
<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <UButton @click="isOpen = true">Excluir</UButton>

  <UModal v-model:open="isOpen" title="Confirmar exclusão">
    <template #body>Tem certeza?</template>
    <template #footer>
      <UButton variant="ghost" @click="isOpen = false">Cancelar</UButton>
      <UButton color="error" @click="confirmDelete">Excluir</UButton>
    </template>
  </UModal>
</template>
```

## A separação que precisa ficar clara

Não confunda "qual item está em edição" (UI/overlay) com "os dados do form"
(domínio/store):

```
caller                          form store
──────                          ──────────
overlay.open({ product })  ───► formStore.load(product.id)   // detalhe completo
.result (saved?)                formStore.save()
```

O overlay cuida de abrir/fechar e passar o item; o form store cuida de
carregar/salvar os dados. Cada um na sua responsabilidade.
