# CalcAUD: Estratégias de Arredondamento

**Arquivo de Origem:** `src/output_helpers/rounding_strategies.ts`

## 1. Por que arredondamento é complexo?

Em sistemas de ponto flutuante, arredondar `0.5` é um pesadelo. `1.005.toFixed(2)` pode resultar em `1.00` ou `1.01` dependendo da representação binária interna.
A `CalcAUD` implementa arredondamento determinístico sobre inteiros.

## 2. Algoritmos Implementados

### A. NBR-5891 (Padrão ABNT / ISO 80000-1)

É o padrão legal no Brasil e em muitas normas científicas.

- **Regra:** Se o dígito seguinte for `< 5`, mantém. Se `> 5`, sobe.
- **O "Pulo do Gato":** Se for **exatamente 5** (seguido de zeros), arredonda para o **dígito par mais próximo**.
- **Exemplo:**
  - `2.5` -> `2` (2 é par)
  - `3.5` -> `4` (4 é par)
- **Motivo:** Evita viés estatístico de sempre arredondar para cima (Half-Up), que inflaria a soma de grandes conjuntos de dados.

### B. HALF-UP (Padrão Escolar)

O método clássico ensinado na escola.

- **Regra:** Se a fração for $\ge 0.5$, arredonda para cima (longe do zero).
- **Exemplo:** `2.5` -> `3`, `-2.5` -> `-3`.

### C. HALF-EVEN (Bankers Rounding)

Similar à NBR-5891, mas focado no padrão internacional IEEE 754 (round to nearest, ties to even). Usado largamente em sistemas financeiros americanos.

### D. TRUNCATE (Corte)

Simplesmente descarta as casas decimais extras.

- **Exemplo:** `2.99` -> `2`.
- **Comportamento:** É um "floor" para positivos e "ceil" para negativos (sempre em direção ao zero).

### E. CEIL (Teto)

Sempre força o valor para o próximo inteiro maior (na direção de $+\infty$).

- **Exemplo:** `2.01` -> `3`.

## 3. Implementação Técnica

Todos os algoritmos funcionam calculando o `remainder` (resto) da divisão inteira entre a escala atual ($10^{12}$) e a escala alvo ($10^{decimals}$).
$$ \text{ScaleDiff} = 10^{(12 - \text{target})} $$

$$ \text{Remainder} = \text{Value} \pmod{\text{ScaleDiff}} $$

A lógica de decisão opera puramente sobre a magnitude desse `Remainder` em relação a `ScaleDiff / 2`.
