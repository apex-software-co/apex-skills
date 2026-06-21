# Stores (Pinia setup stores)

Setup stores sempre: `defineStore('nome', () => {...})`. Tipam melhor que a
Options API e alinham com `<script setup>`.

## Split: store de lista vs store de form

Cada domínio tem dois stores. Separá-los evita o balde: o estado de lista
(filtros, paginação, seleção) e o estado de edição (um item, salvar) têm ciclos
de vida e consumidores diferentes.

| Store | Responsabilidade |
|---|---|
| `useProductStore` | lista, filtros, paginação, seleção em massa |
| `useProductFormStore` | item em edição, salvar/atualizar |

## Store de lista

Estado + sincronização. Nada de cálculo, nada de payload.

```ts
// app/stores/products/product.ts
import type { Product, ProductQuery } from '~/types/products'
import { productResource } from '~/api/endpoints'

export const useProductStore = defineStore('product', () => {
  const items = ref<Product[]>([])
  const query = reactive<ProductQuery>({ search: '', categoryId: null, page: 1 })
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      items.value = await productResource.index(query)
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    await productResource.destroy(id)
    await fetchAll()
  }

  return { items, query, loading, fetchAll, remove }
})
```

## Store de form

Carrega um item, salva. O `load(id)` busca o detalhe completo via `show`. O
salvar delega a montagem do payload a uma função pura — o store não sabe a forma
do payload, só orquestra.

```ts
// app/stores/products/productForm.ts
import type { Product } from '~/types/products'
import { productToPayload, emptyProduct } from '~/types/products'
import { productResource } from '~/api/endpoints'

export const useProductFormStore = defineStore('productForm', () => {
  const form = ref<Product>(emptyProduct())
  const saving = ref(false)

  const isInsert = computed(() => form.value.id === null)

  async function load(id: number) {
    form.value = await productResource.show(id)
  }

  function reset() {
    form.value = emptyProduct()
  }

  async function save(): Promise<Product> {
    saving.value = true
    try {
      const payload = productToPayload(form.value)
      return isInsert.value
        ? await productResource.store(payload)
        : await productResource.update(form.value.id!, payload)
    } finally {
      saving.value = false
    }
  }

  return { form, saving, isInsert, load, reset, save }
})
```

Repare no que **não** está aqui: nenhum `get total`, nenhuma transformação de
dados além de chamar `productToPayload`, nenhum `isDialogOpen`. Esse store fica
abaixo de 50 linhas e continua assim conforme a entidade cresce, porque a
complexidade extra vai para os lugares certos.

## Quando o form fica grande: sub-stores

Uma venda tem itens, e o "item em edição da venda" é um mini-form com sua própria
lógica (quantidade, desconto, número de série). Em vez de inchar o store da
venda, esse sub-form ganha o seu próprio store ou composable.

```ts
// app/stores/sales/saleProductForm.ts
import type { SaleProduct } from '~/types/sales'
import { emptySaleProduct } from '~/types/sales'

export const useSaleProductFormStore = defineStore('saleProductForm', () => {
  const form = ref<SaleProduct>(emptySaleProduct())

  function edit(saleProduct: SaleProduct) {
    form.value = { ...saleProduct }
  }

  function reset() {
    form.value = emptySaleProduct()
  }

  return { form, edit, reset }
})
```

O store da venda compõe esse sub-store quando precisa, mantendo cada um focado.

## O que NÃO vai no store

- **Cálculo derivado** (`total`, `netTotal`) → composable de domínio com
  `computed`. Veja [composables.md](composables.md).
- **Montar payload** (`getSale()`, `toApi()`) → função pura. Veja
  [types.md](types.md).
- **Estado de dialog** (`isOpen`, `selectedForEdit`) → `useOverlay()`. Veja
  [dialogs.md](dialogs.md).

Quando bater a dúvida "isso vai no store?", volte na tabela "o que vai pra onde"
do SKILL.md.
