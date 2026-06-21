# Estrutura de pastas (Nuxt 4)

O Nuxt 4 move o código-fonte para o diretório `app/`. Tudo abaixo é
auto-importado pelo Nuxt, exceto `types/` (interfaces precisam de `import type`
explícito).

```
app/
  components/<domínio>/    ProductList.vue, ProductFormModal.vue
  composables/<domínio>/   useSaleCalculations.ts, useSaleProductForm.ts
  composables/shared/      useAcl.ts, useFormat.ts (transversais)
  stores/<domínio>/        product.ts, productForm.ts   (auto-import Pinia)
  schemas/<domínio>.ts     schema Zod por form
  types/<domínio>.ts       interfaces de entidade e payload (import type)
  constants/<domínio>.ts   enums tipados `as const`
  utils/                   format.ts, calc.ts (funções puras, auto-import)
  api/resource.ts          factory createResource<T>
  api/endpoints.ts         registro dos resources por domínio
  pages/                   file-based routing (kebab-case)
  layouts/
  middleware/
  plugins/                 só boot real de app
  assets/css/main.css      @import "tailwindcss"; @import "@nuxt/ui";
  app.vue                  <UApp><NuxtPage /></UApp>
```

## Regras de organização

**Domínio é a unidade de organização.** `stores/`, `components/`,
`composables/`, `types/`, `schemas/` e `constants/` todos espelham os mesmos
nomes de domínio (`products`, `sales`, `customers`). Quem mexe numa feature
encontra tudo navegando pelo mesmo nome em pastas diferentes.

**`shared/` para o transversal.** Composables que não pertencem a um domínio
(permissões, formatação, brand) vivem em `composables/shared/`.

**Pinia auto-importa `stores/`.** Com o módulo Pinia do Nuxt configurado para
auto-import, `useProductStore` fica disponível sem import. Mantenha um store por
arquivo e o nome do arquivo igual à entidade.

## Plugins — só boot de app

Plugin é caro: roda no boot e infla o bundle inicial. Reserve para o que
genuinamente precisa rodar antes do app: init de SDK terceiro (Firebase,
PostHog, Sentry) e error handler global. **Não** use plugin para:

| Tentação | Onde colocar |
|---|---|
| `$format` / `$calc` | `utils/format.ts`, `utils/calc.ts` (auto-import) |
| `$http` | factory `createResource` em `api/` |
| `$snackbar` / toast | `useToast()` do Nuxt UI |

## Constantes / enums tipados

Saia do array JS solto para `as const` + tipo derivado. Isso transforma os
valores em um union type que o TypeScript verifica em todo lugar:

```ts
// app/constants/products.ts
export const UNITIES = [
  { value: 'un', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'l', label: 'Litro' },
] as const

export type Unity = typeof UNITIES[number]['value']  // 'un' | 'kg' | 'l'
```

Agora `Unity` é um tipo real: uma função que recebe `unity: Unity` rejeita
`'xyz'` em tempo de compilação, e o autocomplete sugere os três valores.

## Utils — funções puras tipadas

`utils/` é auto-importado pelo Nuxt. Coloque funções puras por concern. Exemplo
de formatadores brasileiros:

```ts
// app/utils/format.ts
export function currency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function cpf(value: string): string {
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function dateBr(value: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}
```

Uso direto em qualquer componente, sem import: `{{ currency(product.price) }}`.
