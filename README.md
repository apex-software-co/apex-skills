# apex-skills

Marketplace de **skills do Claude Code** do time Apex. Cada skill é empacotada como um *plugin* independente, então dá pra instalar só o que você quer — estilo packages.

## Como instalar

No Claude Code, adicione o marketplace uma vez:

```
/plugin marketplace add apex-software-co/apex-skills
```

Depois instale os plugins que quiser, individualmente:

```
/plugin install release-notes@apex-skills
```

Comandos úteis:

| Comando | O que faz |
|---|---|
| `/plugin marketplace add apex-software-co/apex-skills` | Adiciona este marketplace |
| `/plugin marketplace update apex-skills` | Atualiza o catálogo (após novos plugins) |
| `/plugin install <plugin>@apex-skills` | Instala um plugin |
| `/plugin list` | Lista plugins instalados |
| `/plugin update <plugin>` | Atualiza um plugin |
| `/plugin uninstall <plugin>` | Remove um plugin |

> As skills ficam disponíveis logo após instalar. Mudanças em hooks/MCP de um plugin podem pedir `/reload-plugins`.

## Plugins disponíveis

| Plugin | Descrição |
|---|---|
| `release-notes` | Gera as mensagens padronizadas de release do apex-agents em três versões (GitHub técnica, parceiros, clientes). |
| `apex-backend-laravel` | Convenções de backend do Apex/Matti ERP (Laravel 11, PHP 8.2, multi-tenant): services por módulo, scoping por organização/empresa, DTOs, repositories, FormRequests e testes. |

## Estrutura do repo

```
apex-skills/
├── .claude-plugin/
│   └── marketplace.json          ← catálogo: lista os plugins instaláveis
├── plugins/
│   └── release-notes/
│       ├── .claude-plugin/
│       │   └── plugin.json        ← manifesto do plugin
│       └── skills/
│           └── release-notes/
│               └── SKILL.md       ← a skill em si
└── README.md
```

## Adicionar uma nova skill

1. Crie `plugins/<nome>/.claude-plugin/plugin.json` (campos: `name`, `description`, `author`, `keywords`).
2. Coloque a skill em `plugins/<nome>/skills/<nome>/SKILL.md` (mais arquivos de apoio, se houver).
3. Adicione uma entrada no array `plugins` de `.claude-plugin/marketplace.json` apontando pra `./plugins/<nome>`.
4. Commit + push. Quem já tem o marketplace roda `/plugin marketplace update apex-skills` pra ver o novo plugin.

> Não fixamos `version` nos `plugin.json` — assim cada commit conta como nova versão (bom enquanto as skills estão em evolução ativa). Quando uma skill estabilizar, dá pra pinar com `"version": "1.0.0"`.

## Instalar sem plugin (cópia manual)

Também dá pra usar qualquer skill sem o marketplace, copiando a pasta direto:

```bash
git clone https://github.com/apex-software-co/apex-skills.git
cp -r apex-skills/plugins/release-notes/skills/release-notes ~/.claude/skills/   # global
# ou para um projeto específico:
cp -r apex-skills/plugins/release-notes/skills/release-notes .claude/skills/
```
