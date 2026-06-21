# Composables — derivados e lógica de domínio

Composables são onde mora a lógica que saiu do store: cálculos derivados,
regras de domínio, sub-forms. Organizados por domínio em `composables/<domínio>/`
com `composables/shared/` para os transversais. O Nuxt auto-importa de subpastas.

```
composables/
  sales/
    useSaleCalculations.ts
    useSaleProductForm.ts
  products/
    useProductFilters.ts
  shared/
    useAcl.ts
    useFormat.ts
```

## Composable de cálculo (substitui os getters do store/valueObject)

Os `get total`, `get netTotal`, `get finalPrice` que inchavam o store viram um
composable que recebe a entidade reativa e devolve `computed`. Recebe um `Ref`
(ou getter) para reagir a mudanças.

```ts
// app/composables/sales/useSaleCalculations.ts
import type { Sale } from '~/types/sales'

export function useSaleCalculations(sale: Ref<Sale>) {
  const productTotal = computed(() =>
    sale.value.products.reduce((acc, p) => acc + p.quantity * p.price, 0),
  )

  const discountTotal = computed(() =>
    sale.value.products.reduce((acc, p) => acc + p.discount, 0),
  )

  const netTotal = computed(() => productTotal.value - discountTotal.value)

  return { productTotal, discountTotal, netTotal }
}
```

Uso no componente, ligando ao estado do store:

```ts
const formStore = useSaleFormStore()
const { form } = storeToRefs(formStore)

const { productTotal, netTotal } = useSaleCalculations(form)
```

Vantagens sobre deixar no store: testável sem montar Pinia, reusável (mesma
conta na tela de venda e no relatório), e o store fica magro.

## Composable de sub-form

Quando o sub-form tem mais lógica que estado (validação cruzada, defaults
calculados), um composable cabe melhor que um store. Use store quando o estado
precisa ser compartilhado entre componentes distantes; use composable quando é
local ao fluxo.

```ts
// app/composables/sales/useSaleProductForm.ts
import type { SaleProduct } from '~/types/sales'
import { emptySaleProduct } from '~/types/sales'

export function useSaleProductForm() {
  const form = ref<SaleProduct>(emptySaleProduct())

  const subtotal = computed(() => form.value.quantity * form.value.price)

  function edit(item: SaleProduct) {
    form.value = { ...item }
  }

  function reset() {
    form.value = emptySaleProduct()
  }

  return { form, subtotal, edit, reset }
}
```

## Composable transversal (`shared/`)

Lógica que não pertence a um domínio — permissões, brand, formatação agregada.

```ts
// app/composables/shared/useAcl.ts
export function useAcl() {
  const auth = useAuthStore()

  function can(permission: string): boolean {
    return auth.permissions.includes(permission)
  }

  return { can }
}
```

## Padrão de export

Use **named export** com a função `useXxx` (`export function useSaleCalculations`),
não `export default`. Named export deixa o nome explícito no arquivo, evita a
ambiguidade de "qual era mesmo o nome deste default" e combina com o auto-import
do Nuxt, que usa o nome do export.
