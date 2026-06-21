// app/types/<domain>.ts
// Troque Resource/resource pelo nome da entidade (ex: Product/product).

export interface Resource {
  id: number | null
  name: string
  // ...campos da entidade, com relações expandidas vindas da API
  createdAt: string
}

export interface ResourcePayload {
  name: string
  // ...só os campos que a API aceita; relações viram *_id
}

export interface ResourceQuery {
  search: string
  page: number
  // ...filtros da listagem
}

export function emptyResource(): Resource {
  return {
    id: null,
    name: '',
    createdAt: '',
  }
}

export function resourceToPayload(resource: Resource): ResourcePayload {
  return {
    name: resource.name,
    // ...mapeie entidade → payload (relações → *_id)
  }
}
