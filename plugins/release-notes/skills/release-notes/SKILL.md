---
name: release-notes
description: Gera as mensagens padronizadas de release do apex-agents em três versões (GitHub técnica, parceiros, clientes). Use ao publicar uma release, anunciar novidades, ou quando o usuário pedir "mensagem de release", "comunicado de versão" ou similar.
---

# Release notes — apex-agents

Gera **três mensagens** para cada release, a partir dos PRs mergeados desde a última release. Cada audiência tem tom e nível de detalhe diferentes.

## Passo a passo

1. **Descobrir o range da release.** A última release é a tag `release-YYYY-MM-DD` mais recente:
   ```bash
   git tag --sort=-creatordate | grep '^release-' | head -1
   ```
   Os PRs da release são os mergeados desde essa tag até `master`:
   ```bash
   git log <ultima-tag>..master --merges --pretty=format:"%s"
   ```
   Para o título/corpo de cada PR, use `gh pr view <num> --json title,body`.

2. **Definir o nome da release.** Padrão `release-YYYY-MM-DD` (data de hoje). Se já existir uma release nessa data, use sufixo `.1`, `.2`, etc. (ex.: `release-2026-06-10.1`).

3. **Classificar cada mudança em duas dimensões.**

   **a) Seção** — encaixe cada mudança numa destas:
   - **🚀 Novos Recursos** — funcionalidade nova, algo que antes não existia. Em geral PRs `feat(...)`.
   - **✨ Melhorias** — otimizações e ajustes do que já existia (mais rápido, mais prático). Em geral `perf(...)`, `refactor(...)`, `chore(...)`.
   - **🛠️ Correções** — bugs corrigidos, comportamento que estava errado e voltou ao normal. Em geral `fix(...)`. *(só parceiros)*
   - **📋 Ações recomendadas** — não vem de um PR direto: é o que o **parceiro deve fazer/comunicar** por causa da release (avisar clientes, revisar config, reimportar dados, conferir agentes). Itens acionáveis, derivados das mudanças. *(só parceiros)*

   **b) Visibilidade** — quem vê a mudança:
   - **Visível ao usuário** (feature, correção perceptível, ganho de velocidade) → entra em parceiros/clientes.
   - **Interna** (refactor, índice de banco, CI, perf de backend sem efeito visível) → fica só na versão técnica do GitHub. Nunca exponha detalhes internos pra clientes.

4. **Gerar os três arquivos** em `tmp/releases/<nome-da-release>/`:
   - `github.md` — notas técnicas (corpo da GitHub release)
   - `parceiros.md` — comunicado pra parceiros
   - `clientes.md` — comunicado pra clientes finais

   `tmp/releases/` é **gitignored** — as mensagens são efêmeras e não devem virar commit/PR. Só a skill fica versionada.

## Estrutura por público

Cada público tem um conjunto de seções, **sempre nesta ordem**. Regra geral: **omita uma seção se ela ficar vazia** para aquele público.

| Seção | GitHub | Parceiros | Clientes |
|---|:---:|:---:|:---:|
| 🚀 Novos Recursos | ✅ | ✅ | ✅ |
| ✨ Melhorias | ✅ | ✅ | ✅ |
| 🛠️ Correções | ✅ | ✅ | ❌ |
| 📋 Ações recomendadas | ❌ | ✅ | ❌ |

- **Título (identifica o destinatário pelo próprio título):**
  - GitHub → `Deploy de produção (API + Web + Site).`
  - Parceiros → `🤝 *Novidades para parceiros* (DD/MM)`
  - Clientes → `🚀 *Novidades na plataforma!* (DD/MM)`

  O emoji + a palavra do público no título deixam óbvio de relance qual mensagem é qual na hora de copiar, sem precisar rotular na mão. Mantenha esses títulos exatos — não use o mesmo título para parceiros e clientes.
- **Parceiros** é a versão mais completa (operação/suporte): inclui Correções e fecha com **Ações recomendadas**.
- **Clientes** é enxuta e comercial: só Recursos + Melhorias, sem correções nem ações internas.
- O **fechamento** (contato/CTA) existe só em parceiros/clientes; a versão GitHub fecha com o changelog.

Esqueleto (parceiros, versão completa):

```
<Título com data>

🚀 *Novos Recursos*
- ...

✨ *Melhorias*
- ...

🛠️ *Correções*
- ...

📋 *Ações recomendadas*
- ...

<fechamento>
```

## As três mensagens

### `github.md` — técnica (GitHub release notes)
- Idioma: português, tom técnico e direto.
- Abre com a linha de deploy: `Deploy de produção (API + Web + Site).`
- Em seguida as seções `## 🚀 Novos Recursos` e `## ✨ Melhorias`, cada item com número do PR (`#NNN`) e título do commit/merge.
- Fecha com o link de comparação:
  `**Full Changelog:** https://github.com/apex-software-co/apex-agents/compare/<tag-anterior>...<tag-nova>`
- É o `--notes` usado no `gh release create`.

### `parceiros.md` — parceiros (time de operação/suporte)
- Abre com o título de parceiros: `🤝 *Novidades para parceiros* (DD/MM)`.
- Versão **mais completa**: Novos Recursos + Melhorias + Correções + Ações recomendadas.
- Idioma: português, **sem jargão técnico**, mas **explicando o que mudou e o benefício** de cada item.
- Foco em "o que vocês conseguem fazer agora" e no que precisam saber pra dar suporte. Pode incluir mudanças de comportamento e correções de bugs.
- **Ações recomendadas:** termine com itens acionáveis derivados da release (avisar clientes, revisar config, reimportar dados). Se não houver nenhuma ação real, omita a seção — não invente.
- Alguns emojis (1 por item + abertura/fechamento). Use `*negrito*` no formato WhatsApp.

### `clientes.md` — clientes finais (comercial)
- Abre com o título de clientes: `🚀 *Novidades na plataforma!* (DD/MM)`.
- Versão **enxuta**: só Novos Recursos + Melhorias.
- Idioma: português, tom **comercial e empolgante**, vendendo o valor.
- **Sem nenhum detalhe interno** — nada de nomes de telas técnicas, performance de backend, índices, CI, correções de bug ou ações operacionais.
- Só novidades que o cliente percebe e valoriza. Se um item não traz nada visível pro cliente, **não cite**.
- Alguns emojis, frases curtas, chamada pra ação leve no fim. Formato WhatsApp (`*negrito*`).

## Regras de estilo (todas as versões)
- Sempre português (pt-BR).
- Emojis com moderação — alguns, não em todo fim de frase.
- Negrito no padrão WhatsApp (`*texto*`) nas versões parceiros/clientes; markdown normal (`**texto**`) na versão GitHub.
- Não invente funcionalidades: descreva só o que está nos PRs.

## Exemplo de referência
A release `release-2026-06-12` foi gerada com esta skill (três versões: github / parceiros / clientes).
