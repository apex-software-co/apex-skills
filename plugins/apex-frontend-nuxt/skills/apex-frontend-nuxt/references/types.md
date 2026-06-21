# Tipos — entidade, payload e o fim do Proxy

Os tipos vivem em `app/types/<domínio>.ts` e são importados com `import type`
explícito (o Nuxt não auto-importa interfaces — e tudo bem, import explícito
deixa claro de onde o tipo vem).

## Entidade vs Payload

Separe **o que vem da API** (entidade) do **o que você manda de volta**
(payload). Eles diferem de propósito: a entidade tem `id`, timestamps, relações
expandidas; o payload tem só os campos que a API aceita, muitas vezes em
`snake_case` e com IDs no lugar de objetos. Manter os dois lado a lado torna a
fronteira de serialização explícita.

```ts
// app/types/products.ts
export interface Product {
  id: number | null
  name: string
  price: number
  unity: Unity
  category: Category | null      // relação expandida vinda da API
  createdAt: string
}

export interface ProductPayload {
  name: string
  price: number
  unity: Unity
  category_id: number | null     // só o id volta pra API
}
```

## Função de payload (substitui o `getSale()` do valueObject)

A transformação entidade → payload é uma **função pura tipada**, não um método
de objeto e muito menos um getter de Proxy. Pura = mesma entrada, mesma saída,
sem efeito colateral; fácil de testar isoladamente.

```ts
// app/types/products.ts (continuação)
export function productToPayload(product: Product): ProductPayload {
  return {
    name: product.name,
    price: product.price,
    unity: product.unity,
    category_id: product.category?.id ?? null,
  }
}

export function emptyProduct(): Product {
  return {
    id: null,
    name: '',
    price: 0,
    unity: 'un',
    category: null,
    createdAt: '',
  }
}
```

O `emptyProduct()` dá ao store de form um ponto de partida tipado para inserção
(`reset()`), sem `as any` nem objeto solto.

## Por que NÃO usar Proxy / valueObject

O padrão antigo embrulhava a entidade num `Proxy` com getters (`get total`) e um
método `getSale()`. Três problemas concretos:

1. **Mata a inferência de tipos.** `new Proxy(sale, {...})` retorna um tipo que o
   TypeScript não consegue estreitar — você perde autocomplete e checagem justo
   na entidade central. Adotar TS e depois embrulhar tudo em Proxy joga fora o
   benefício.
2. **Reimplementa a reatividade do Vue.** Getters reativos e interceptação de
   `set` são exatamente o que `reactive`/`computed` fazem nativamente. O Proxy é
   código duplicando o framework.
3. **Mistura responsabilidades.** Um valueObject carrega cálculo (`get total`) e
   serialização (`getSale()`) no mesmo objeto. São coisas diferentes que devem
   morar em lugares diferentes.

Substituição limpa:

| Antes (valueObject) | Depois |
|---|---|
| `get total()` | `computed` num composable de domínio → [composables.md](composables.md) |
| `getSale()` | função pura `saleToPayload(sale)` (aqui) |
| `new Proxy(...)` | nada — Vue já é reativo |

## Tipo de entidade vs tipo de form

Cuidado para não confundir dois tipos com propósitos diferentes:

- **Entidade** (`Product`) — escrita à mão aqui em `types/`, representa o dado de
  domínio.
- **Input de form** — gerado pelo schema Zod com `z.infer<typeof schema>`,
  representa o que o usuário digita e o que será validado. Vive junto do schema.
  Veja [forms.md](forms.md).

Os dois coexistem: o form valida o input com Zod, e ao salvar você converte para
a entidade/payload.
