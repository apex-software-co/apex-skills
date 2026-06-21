# apex-statusline

Statusline (a "custom bar") do time **Apex** para o Claude Code.

```
📁 apex-skills | 🌿 master | 🧠 ███▌░░░░░░ 34% | 🔤 45.2k | 💰 $0.18 | ⏱️ 12m 03s | ▲ Apex Software
```

Mostra, da esquerda pra direita:

| Segmento | O que é |
|---|---|
| 📁 | Pasta atual do workspace |
| 🌿 | Branch git (some fora de repositório) |
| 🧠 | Barra de uso do **context window**, fracionada em oitavos de bloco (resolução de 80 níveis), verde → amarelo (≥70%) → vermelho (≥90%) |
| 🔤 | Tokens da sessão (input + output), humanizado (`45.2k`) |
| 💰 | Custo acumulado da sessão em USD |
| ⏱️ | Duração da sessão |
| ▲ | Marca **Apex Software** |

## Instalação

Adicione o marketplace (uma vez) e instale o plugin:

```
/plugin marketplace add apex-software-co/apex-skills
/plugin install apex-statusline@apex-skills
```

> **Importante:** um plugin do Claude Code **não consegue ativar a statusline principal sozinho** — o `settings.json` de plugin só aceita `agent` e `subagentStatusLine`. Então, após instalar, falta **uma linha** na sua config apontando pro script do plugin.

Adicione ao seu `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "\"${CLAUDE_PLUGIN_ROOT}\"/statusline.sh",
    "padding": 0
  }
}
```

`${CLAUDE_PLUGIN_ROOT}` resolve para a pasta do plugin instalado. Se por algum motivo a variável não for substituída no seu ambiente, use o caminho absoluto da instalação:

```
~/.claude/plugins/marketplaces/apex-skills/plugins/apex-statusline/statusline.sh
```

Recarregue com `/reload-plugins` (ou reabra a sessão) e a barra aparece.

## Dependências

O script é Bash e usa utilitários comuns:

- **`jq`** — parse do JSON que o Claude Code envia via stdin
- **`awk`** — cálculo da barra fracionada e humanização de tokens
- **`git`** — para mostrar a branch (opcional; só ativa dentro de repositório)
- Terminal com **Unicode** (usa glyphs de bloco `█ ▏▎▍▌▋▊▉ ░` e emojis). Não precisa de Nerd Font.

## Customização

- **Largura da barra:** `WIDTH=10` no script.
- **Faixas de cor:** os limiares `≥90` (vermelho) e `≥70` (amarelo).
- **Cor da marca:** `BRAND='\033[92m'` (verde brilhante do ▲).
