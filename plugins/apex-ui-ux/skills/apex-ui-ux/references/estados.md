# Estados — loading, vazio, erro, feedback

A regra mãe: **toda lista/tela trata os 4 estados explicitamente** — carregando,
vazio, erro, conteúdo. Não deixe nenhum implícito (ex.: "tela em branco enquanto
carrega" é um estado não tratado).

## Ciclo de vida da view (`isBooted`)

Toda view que busca dados tem um flag que diz "já terminei a primeira carga?".

- Enquanto `!isBooted` → mostra **skeleton**.
- Depois → mostra conteúdo **ou** estado vazio.
- Use **um nome único** pra esse flag em todo o projeto (`isBooted`). Não invente
  `loading`/`isLoading`/`loaded` em paralelo pra mesma coisa.

> **Débito conhecido:** o código atual mistura `loading`, `isLoading` e `isBooted`
> pra papéis diferentes (carga inicial vs request em andamento). No código novo,
> separe: `isBooted` = "primeira carga concluída"; o loading de mutação vive no
> overlay global, não num ref local solto.

## Skeleton (carga inicial)

- O skeleton **imita o layout final** (cabeçalho, linhas, cards na mesma posição),
  não um spinner genérico no meio da tela. Quanto mais fiel, menos "pulo" quando o
  conteúdo chega. Para telas complexas (ex.: POS), vale um skeleton dedicado que
  reproduz as áreas reais (busca, grade de produtos, carrinho).
- Skeleton é pra **carga inicial**, não pra refiltragem. Ao refiltrar uma lista já
  carregada, prefira loading sutil (no campo de busca / leve dim) e mantenha o
  conteúdo anterior visível.

> **Débito conhecido:** a contagem de linhas do skeleton é fixa (18). O alvo é
> refletir o tamanho real esperado da lista (ou a página).

## Estado vazio (cidadão de primeira classe)

Vazio **sempre** é "marcado": ícone + mensagem centrados, nunca uma área em
branco. Distinga dois casos — eles pedem UX diferente:

| Caso | UX |
|---|---|
| **Vazio por filtro/busca** (existem dados, o filtro não achou) | Mensagem neutra: "Nenhum resultado". Sem CTA de criação. |
| **Nunca criou nada** (estado inicial do domínio) | **Onboarding**: ícone + texto explicativo + **CTA primário** ("Criar o primeiro produto"). |

A lista decide qual mostrar: se há filtro ativo → "sem resultado"; se a base está
vazia de verdade → onboarding.

## Erro de request é global

- Erro de HTTP **não** é tratado no componente. Sobe pra um **handler central** que
  exibe um **toast** e discrimina o tipo: 422 (validação), 404, 500, rede.
- Componentes e stores **não carregam estado de erro de request** — sem `error.value`
  espalhado, sem `try/catch` que só mostra mensagem. Deixa o handler global agir.
- Mensagens por tipo: 422 → erro de validação legível; 404 → "recurso não
  encontrado"; 500/rede → "erro no servidor, equipe já avisada".

> **Débito conhecido:** hoje o 422 só vira toast. O **alvo** é também devolver a
> mensagem pro **campo correspondente** do form (inline) — ver `controles.md`.

## Loading de mutação (salvar/excluir/sincronizar)

- Ação que muda dados e precisa bloquear a tela → **overlay global bloqueante**
  via `useLoading` (`start()` / `stop()`). O usuário não interage durante a escrita.
- **Sempre** garanta o `stop` com `try/finally` (ou interceptor). Esquecer o `stop`
  deixa a tela travada.

```js
async function save() {
  loading.start()
  try {
    const saved = await store.save()
    emit('store', saved)
    close()
  } finally {
    loading.stop()
  }
}
```

> **Débito conhecido:** hoje `start/stop` é manual em cada ação, sem interceptor —
> daí o risco de esquecer o `stop`. O `try/finally` acima é o mínimo; um interceptor
> HTTP que liga/desliga o loading é o alvo.

## Wait-for-response é a regra

A UI reflete a **verdade do servidor**: só atualiza o estado **depois** da resposta.
Sem update otimista por padrão (sem rollback pra manter, menos bug de consistência).
Use otimismo só com justificativa explícita (ex.: toggle de altíssima frequência) e
documentando o rollback.
