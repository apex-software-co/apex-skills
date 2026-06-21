#!/bin/bash
input=$(cat)

DIR=$(echo "$input" | jq -r '.workspace.current_dir')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
PCT_RAW=$(echo "$input" | jq -r '.context_window.used_percentage // 0')
PCT=${PCT_RAW%.*}
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')
TOKENS=$(echo "$input" | jq -r '(.context_window.total_input_tokens // 0) + (.context_window.total_output_tokens // 0)')

CYAN='\033[36m'; GREEN='\033[32m'; YELLOW='\033[33m'; RED='\033[31m'; DIM='\033[2m'; RESET='\033[0m'
BRAND='\033[92m' # bright green for the Apex ▲

# Pick bar color based on context usage
if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

# Fractional 10-char bar using eighth-block glyphs (80 levels of resolution),
# so even a low percentage against a 1M context window shows a partial block.
WIDTH=10
EIGHTHS=$(awk "BEGIN{printf \"%d\", ($PCT_RAW/100)*$WIDTH*8 + 0.5}")
FULL=$((EIGHTHS / 8)); REM=$((EIGHTHS % 8))
[ "$FULL" -gt "$WIDTH" ] && FULL=$WIDTH && REM=0
PARTIALS=("" "▏" "▎" "▍" "▌" "▋" "▊" "▉")
PARTIAL="${PARTIALS[$REM]}"
EMPTY=$((WIDTH - FULL)); [ -n "$PARTIAL" ] && EMPTY=$((EMPTY - 1))
[ "$EMPTY" -lt 0 ] && EMPTY=0
printf -v FILL "%${FULL}s"; printf -v PAD "%${EMPTY}s"
BAR="${FILL// /█}${PARTIAL}${PAD// /░}"

MINS=$((DURATION_MS / 60000)); SECS=$(((DURATION_MS % 60000) / 1000))

# Humanize token count (e.g. 45.2k)
if [ "$TOKENS" -ge 1000 ]; then
  TOK_FMT=$(awk "BEGIN{printf \"%.1fk\", $TOKENS/1000}")
else
  TOK_FMT="$TOKENS"
fi

BRANCH=""
git rev-parse --git-dir > /dev/null 2>&1 && BRANCH=" ${DIM}|${RESET} 🌿 $(git branch --show-current 2>/dev/null)"

COST_FMT=$(printf '$%.2f' "$COST")
SEP="${DIM}|${RESET}"

echo -e "${CYAN}📁 ${DIR##*/}${RESET}${BRANCH} ${SEP} 🧠 ${BAR_COLOR}${BAR}${RESET} ${PCT}% ${SEP} 🔤 ${TOK_FMT} ${SEP} 💰 ${YELLOW}${COST_FMT}${RESET} ${SEP} ⏱️ ${MINS}m ${SECS}s ${SEP} ${BRAND}▲ Apex${RESET} ${DIM}Software${RESET}"
