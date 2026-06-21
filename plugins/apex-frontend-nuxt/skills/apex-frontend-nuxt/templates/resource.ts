// app/api/resource.ts — a factory genérica (escreva uma vez por projeto).

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
    destroy: (id) => $fetch<void>(`${endpoint}/${id}`, { method: 'DELETE' }),
  }
}

// ---------------------------------------------------------------------------
// app/api/endpoints.ts — registre um resource por domínio.
//
// import type { Product, ProductPayload } from '~/types/products'
// import { createResource } from './resource'
//
// export const productResource = createResource<Product, ProductPayload>('/products')
