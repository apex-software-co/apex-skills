// app/stores/<domain>/<resource>Form.ts — store de FORM (carrega um item, salva).
import type { Resource } from '~/types/<domain>'
import { emptyResource, resourceToPayload } from '~/types/<domain>'
import { resourceResource } from '~/api/endpoints'

export const useResourceFormStore = defineStore('resourceForm', () => {
  const form = ref<Resource>(emptyResource())
  const saving = ref(false)

  const isInsert = computed(() => form.value.id === null)

  async function load(id: number) {
    form.value = await resourceResource.show(id)
  }

  function reset() {
    form.value = emptyResource()
  }

  async function save(): Promise<Resource> {
    saving.value = true
    try {
      const payload = resourceToPayload(form.value)
      return isInsert.value
        ? await resourceResource.store(payload)
        : await resourceResource.update(form.value.id!, payload)
    } finally {
      saving.value = false
    }
  }

  return { form, saving, isInsert, load, reset, save }
})

// O que NÃO vai aqui:
// - Cálculo derivado  → composable de domínio (useResourceCalculations)
// - Montar payload    → função pura resourceToPayload (em types/)
// - Estado de dialog  → useOverlay() (ver references/dialogs.md)
