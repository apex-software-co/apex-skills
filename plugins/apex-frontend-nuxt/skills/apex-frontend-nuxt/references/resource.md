# Camada HTTP — `createResource<T>`

Toda chamada de API passa por um resource tipado construído sobre o `$fetch`
nativo do Nuxt. Sem Axios: `$fetch` é SSR-friendly, já lê o `baseURL` do runtime
config e participa do payload de hidratação do Nuxt.

## A factory

Uma factory genérica gera o CRUD tipado para qualquer entidade. Escreva uma vez,
use em todo domínio.

```ts
// app/api/resource.ts
export interface Resource<Entity, Payload = Partial<Entity>> {
  index(query?: Record<string, unknown>): Promise<Entity[]>
  show(id: number | string): Promise<Entity>
  store(payload: Payload): Promise<Entity>
  update(id: number | string, payload: Payload): Promise<Entity>
  destroy(id: number | string): Promise<void>
}

export function createResource<Entity, Payload = Partial<Entity>>(
  endpoint: string,
): Resource<Entity, Payload> {
  return {
    index: (query) => $fetch<Entity[]>(endpoint, { query }),
    show: (id) => $fetch<Entity>(`${endpoint}/${id}`),
    store: (payload) => $fetch<Entity>(endpoint, { method: 'POST', body: payload }),
    update: (id, payload) =>
      $fetch<Entity>(`${endpoint}/${id}`, { method: 'PUT', body: payload }),
    destroy: (id) =>
      $fetch<void>(`${endpoint}/${id}`, { method: 'DELETE' }),
  }
}
```

O `baseURL` e os headers de auth ficam centralizados configurando o `$fetch`
global uma vez (plugin de boot ou `ofetch` customizado), não repetidos em cada
resource.

## Registro dos endpoints

Cada domínio registra seu resource num lugar só, tipando entidade e payload.

```ts
// app/api/endpoints.ts
import type { Product, ProductPayload } from '~/types/products'
import type { Sale, SalePayload } from '~/types/sales'
import { createResource } from './resource'

export const productResource = createResource<Product, ProductPayload>('/products')
export const saleResource = createResource<Sale, SalePayload>('/sales')
```

Agora `productResource.index()` retorna `Promise<Product[]>` e
`productResource.store(payload)` exige um `ProductPayload` — o compilador pega
campo errado ou faltando antes de rodar.

## Quem chama o resource

**Só o store.** O componente fala com o store; o store fala com o resource. Essa
cadeia mantém endpoints centralizados e os componentes ignorantes de URLs.

```
Componente  →  Store  →  Resource  →  API
```

`$fetch`/`useFetch` direto num componente é um desvio (item do checklist). A
exceção legítima é uma página puramente de leitura que usa `useAsyncData` para
SSR de dados que nenhum store precisa guardar — aí documente o porquê.

## Erros

Trate erros de forma centralizada (interceptor do `$fetch` global ou um wrapper)
para padronizar toast de erro e refresh de token. O store não deve repetir
`try/catch` de UI em cada ação — ele cuida só do `loading`; a notificação de
erro é responsabilidade da camada de fetch + `useToast()`.
