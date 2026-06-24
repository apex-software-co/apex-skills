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
      <!-- Escala em references/espacamento-tipografia.md. Campos com space-y-4; -->
      <!-- gap-6 separa o grupo de campos do rodapé de ações. -->
      <UForm :schema="resourceSchema" :state="state" @submit="onSubmit" class="space-y-6">
        <!-- Campos do form: ritmo vertical space-y-4 -->
        <div class="space-y-4">
          <UFormField name="name" label="Nome" required>
            <UInput v-model="state.name" />
          </UFormField>
        </div>

        <!-- Rodapé de ações: cancelar à esquerda, confirmar à direita, gap-2 -->
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="emit('close', false)">Cancelar</UButton>
          <UButton type="submit" :loading="formStore.saving">Salvar</UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
