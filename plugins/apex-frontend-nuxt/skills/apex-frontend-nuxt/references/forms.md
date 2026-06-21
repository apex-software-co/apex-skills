# Forms e validação — Zod + UForm

Validação por **schema Zod**, não por regras manuais espalhadas. O schema é
fonte única: valida o input **e** gera o tipo do form. O `UForm` do Nuxt UI lê o
schema e valida automaticamente antes de emitir `@submit`.

## O schema

Um schema por form, em `app/schemas/<domínio>.ts`. As mensagens de erro vão no
próprio schema, em português.

```ts
// app/schemas/products.ts
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.number().positive('Preço deve ser maior que zero'),
  unity: z.enum(['un', 'kg', 'l']),
  categoryId: z.number().nullable(),
})

export type ProductFormInput = z.infer<typeof productSchema>
```

O `z.infer` gera `ProductFormInput` automaticamente — uma fonte só para
validação e tipo. Se você adicionar um campo ao schema, o tipo acompanha.

## O componente de form

`UForm` recebe `:schema` e `:state`. Os campos vão em `UFormField` com `name`
casando a chave do schema — é assim que o erro de validação aparece no campo
certo. Quando o `@submit` dispara, o `state` já passou pela validação.

```vue
<script setup lang="ts">
import { productSchema, type ProductFormInput } from '~/schemas/products'

const props = defineProps<{ product?: Product }>()
const emit = defineEmits<{ close: [saved: boolean] }>()

const formStore = useProductFormStore()

const state = ref<Partial<ProductFormInput>>({
  name: props.product?.name ?? '',
  price: props.product?.price ?? 0,
  unity: props.product?.unity ?? 'un',
  categoryId: props.product?.category?.id ?? null,
})

async function onSubmit() {
  // chega aqui só se o schema validou
  formStore.form = { ...formStore.form, ...state.value }
  await formStore.save()
  emit('close', true)
}
</script>

<template>
  <UForm :schema="productSchema" :state="state" @submit="onSubmit">
    <UFormField name="name" label="Nome" required>
      <UInput v-model="state.name" />
    </UFormField>

    <UFormField name="price" label="Preço" required>
      <UInput v-model.number="state.price" type="number" />
    </UFormField>

    <UFormField name="unity" label="Unidade">
      <USelect v-model="state.unity" :items="UNITIES" />
    </UFormField>

    <UButton type="submit" :loading="formStore.saving">Salvar</UButton>
  </UForm>
</template>
```

## `ref` (não `reactive`) para o state

Use `ref` para o objeto de state do form, não `reactive`. A diferença que
importa: com `reactive` você não pode reatribuir o objeto inteiro
(`state = {...}` quebra a reatividade), e o form precisa exatamente disso ao
resetar ("novo") ou recarregar com outro item ("editar"). Com `ref` o
`state.value = {...}` funciona e mantém a reatividade — além de ficar consistente
com o `form.value` do store, que também reatribui no `load()`/`reset()`. No
template o `ref` auto-desempacota, então `:state="state"` e `v-model="state.x"`
seguem limpos, sem `.value`. (A doc do Nuxt UI mostra `reactive` só por
ergonomia de não escrever `.value` no script.)

## Os três tipos em jogo (e por que são três)

É fácil confundir, então deixe explícito:

| Tipo | Origem | Papel |
|---|---|---|
| `Product` (entidade) | escrito à mão em `types/` | o dado de domínio, com `id`, relações |
| `ProductPayload` | escrito à mão em `types/` | o que vai pra API ao salvar |
| `ProductFormInput` | `z.infer` do schema | o que o usuário digita e o que é validado |

Fluxo: o usuário preenche o `state` (`ProductFormInput`) → o `UForm` valida com
Zod → no submit você funde no `form` do store (`Product`) → o store chama
`productToPayload` (`ProductPayload`) → o resource envia. Cada tipo no seu
estágio.

## Por que schema em vez de regras manuais

Regras manuais (`if (!name) errors.name = ...`) espalham a validação, não geram
tipo, e duplicam o que o schema já expressa declarativamente. O schema Zod é
menor, é a fonte do tipo, e o `UForm` o consome nativamente — menos código e uma
verdade só.
