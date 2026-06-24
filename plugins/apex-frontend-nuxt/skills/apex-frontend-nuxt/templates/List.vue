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
  <!-- Escala de espaçamento/tipografia: references/espacamento-tipografia.md. -->
  <!-- Padding da página sobe no desktop; blocos (header → filtros → tabela) -->
  <!-- com space-y-6 md:space-y-8 no container, nunca margin por filho. -->
  <div class="p-4 md:p-6 space-y-6 md:space-y-8">
    <!-- Header de página: título (text-xl/semibold) + ação primária -->
    <div class="flex items-center justify-between gap-2">
      <h1 class="text-xl font-semibold">Recursos</h1>
      <UButton icon="i-lucide-plus" @click="create">Novo</UButton>
    </div>

    <!-- Barra de filtros -->
    <div class="flex justify-between gap-2">
      <UInput v-model="store.query.search" placeholder="Buscar..." />
    </div>

    <!-- Conteúdo (corpo da tabela em text-sm font-normal, default da lib) -->
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
