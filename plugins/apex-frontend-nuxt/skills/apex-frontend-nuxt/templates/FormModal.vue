<!-- app/components/<domain>/ResourceFormModal.vue -->
<!-- Aberto via useOverlay() (ver references/dialogs.md). Recebe a entidade por -->
<!-- prop e devolve o resultado por emit('close', saved). -->
<script setup lang="ts">
import { resourceSchema, type ResourceFormInput } from '~/schemas/<domain>'
import type { Resource } from '~/types/<domain>'

const props = defineProps<{ resource?: Resource }>()
const emit = defineEmits<{ close: [saved: boolean] }>()

const formStore = useResourceFormStore()

// ref (não reactive): permite reatribuir o objeto inteiro no reset/reload sem
// perder reatividade, consistente com o form.value do store.
const state = ref<Partial<ResourceFormInput>>({
  name: props.resource?.name ?? '',
})

async function onSubmit() {
  // chega aqui só se o schema validou
  formStore.form = { ...formStore.form, ...state.value }
  await formStore.save()
  emit('close', true)
}
</script>

<template>
  <UModal :title="props.resource ? 'Editar' : 'Novo'">
    <template #body>
      <UForm :schema="resourceSchema" :state="state" @submit="onSubmit">
        <UFormField name="name" label="Nome" required>
          <UInput v-model="state.name" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="emit('close', false)">Cancelar</UButton>
          <UButton type="submit" :loading="formStore.saving">Salvar</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
