<!-- app/components/<domain>/ResourceList.vue -->
<!-- Lista do domínio. Fala com o store (nunca $fetch direto). Abre o form via -->
<!-- useOverlay() programático (ver references/dialogs.md). -->
<script setup lang="ts">
import type { Resource } from '~/types/<domain>'
import ResourceFormModal from './ResourceFormModal.vue'

const store = useResourceStore()
const formStore = useResourceFormStore()
const { items, loading } = storeToRefs(store)

const overlay = useOverlay()
const resourceForm = overlay.create(ResourceFormModal)

onMounted(() => store.fetchAll())

async function create() {
  formStore.reset()
  const saved = await resourceForm.open({}).result
  if (saved) await store.fetchAll()
}

async function edit(resource: Resource) {
  await formStore.load(resource.id!)
  const saved = await resourceForm.open({ resource }).result
  if (saved) await store.fetchAll()
}

const columns = [
  { accessorKey: 'name', header: 'Nome' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <UInput v-model="store.query.search" placeholder="Buscar..." />
      <UButton icon="i-lucide-plus" @click="create">Novo</UButton>
    </div>

    <UTable :data="items" :columns="columns" :loading="loading">
      <template #actions-cell="{ row }">
        <UButton
          icon="i-lucide-pencil"
          variant="ghost"
          @click="edit(row.original)"
        />
      </template>
    </UTable>
  </div>
</template>
