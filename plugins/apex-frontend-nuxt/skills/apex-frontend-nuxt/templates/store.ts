// app/stores/<domain>/<resource>.ts — store de LISTA (estado + sync).
import type { Resource, ResourceQuery } from '~/types/<domain>'
import { resourceResource } from '~/api/endpoints'

export const useResourceStore = defineStore('resource', () => {
  const items = ref<Resource[]>([])
  const query = reactive<ResourceQuery>({ search: '', page: 1 })
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      items.value = await resourceResource.index(query)
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    await resourceResource.destroy(id)
    await fetchAll()
  }

  return { items, query, loading, fetchAll, remove }
})

// Regras:
// - Só estado + sync. Sem cálculo, sem payload, sem estado de dialog.
// - Passou de ~150 linhas ou misturou responsabilidade? Extraia (ver SKILL.md).
