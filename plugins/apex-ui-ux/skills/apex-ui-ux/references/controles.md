# Controles — botões, ícones, dialogs, forms, tabelas

## Botões

Botão se escolhe pela **intenção**, não pela aparência. Cada intenção tem um papel
fixo (no apex-pos isso vira wrappers semânticos: `AppConfirmBtn`, `AppCancelBtn`,
`AppDeleteBtn`, `AppAddBtn`, `AppCloseBtn`, `AppBackBtn`):

| Intenção | Estilo | Posição |
|---|---|---|
| Confirmar / salvar (ação principal) | **Primário** (sólido, cor da marca) | À direita |
| Cancelar / fechar / voltar | Discreto (plain/texto) | À esquerda |
| Excluir / destrutivo | Discreto **+ confirmado** (ver ConfirmDialog) | Contextual |
| Novo / adicionar | Primário com ícone `+` | Header da página |
| Ação de linha (tabela) | Botão-ícone → menu 3-pontinhos | Na linha |

Regras:

- **Um único CTA primário por contexto.** Dois botões primários competindo = nenhum
  é principal. O resto vira discreto.
- **Posição fixa**: rodapé de form/dialog com `justify-end`, cancelar à esquerda,
  confirmar à direita. Não inverta entre telas.
- Texto de ação no botão (rótulo claro), não só ícone, salvo ações de linha.

## Ícones

- **Um sistema único de ícones** (hugeicons, via um componente `AppIcon` que resolve
  cor pelo tema). Escolha nomes consistentes por ação (excluir, editar, info…).
- Antes de inventar um nome de ícone, procure o uso existente da mesma ação.

> **Débito conhecido:** ainda há `mdi` legado convivendo com hugeicons. Código novo
> usa **só** hugeicons.

## Dialogs

- **Abrir/fechar** é exposto pelo próprio componente de dialog/form (um método
  `open()`/`close()`); o pai chama e, ao salvar, o dialog **emite um evento**
  (`store`/`saved`) → o pai recarrega a lista.
- **Estado aberto/fechado não mora no store.** Incha o store e acopla. No stack
  alvo (Nuxt UI) isso é o `useOverlay()` programático — ver skill
  **`apex-frontend-nuxt`** pra implementação.
- **Fullscreen no mobile.**
- **Confirmação destrutiva é Promise-based**: um `ConfirmDialog` que resolve quando
  o usuário confirma. Quem chama só age no `.then`/após o `await`.

```js
// padrão de confirmação destrutiva
async function remove(item) {
  const ok = await confirmDialog.open({
    title: 'Excluir produto?',
    message: 'Essa ação não pode ser desfeita.',
  })
  if (!ok) return
  await store.destroy(item.id)
}
```

## Forms

- **Campos via componentes consistentes** (mesmo estilo/variante em todo o app:
  `AppTextField`, `AppSelect`, `AppMoneyField`, máscaras de CPF/CNPJ etc.). Não
  use o input cru da lib direto numa tela e o wrapper em outra.
- **Validação → erro inline no campo.** A mensagem aparece **no campo** que falhou,
  não só num toast global. Campo obrigatório tem **indicador visual** (asterisco ou
  marca equivalente).
- **Save flow**: bloqueia a UI (overlay) → no sucesso emite evento e fecha → erro de
  request sobe pro handler global. Ver `estados.md` pro `try/finally`.
- **Seções opcionais** marcadas explicitamente ("Endereço (opcional)"), idealmente
  recolhíveis.

> **Débito conhecido:** a validação atual é custom (sem schema), o 422 só vira toast
> e não há indicador de obrigatório. **Alvo:** schema único por form (Zod no stack
> novo — ver `apex-frontend-nuxt`), erro inline no campo, asterisco no obrigatório.

## Tabelas

- **Sem footer nativo** — paginação é um componente próprio que também orquestra
  skeleton e estado vazio (ver `estados.md`).
- **Ações de linha** num **menu de 3-pontinhos** (botão-ícone → menu com Editar,
  Excluir, etc.). Não espalhe 4 ícones soltos por linha.
- **Seleção pra ação em massa** quando houver operação em lote (checkbox por linha,
  seleção condicional quando só certos status permitem).
- **Ordenação** por header quando fizer sentido.
- No mobile a tabela vira **lista** — ver `telas.md`.
