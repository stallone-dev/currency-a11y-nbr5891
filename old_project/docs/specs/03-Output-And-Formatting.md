# CalcAUD: Sistema de Output e Formatação

**Arquivos de Origem:** `src/output.ts`, `src/output_helpers/`

## 1. Conceito: Separação Cálculo-Exibição

Um erro comum em sistemas financeiros é arredondar valores _durante_ o cálculo para "ficar bonito" na tela. Isso introduz erros cumulativos.
A `CalcAUD` separa estritamente:

1. **Cálculo:** Sempre em 12 casas decimais (`CalcAUD` class).
2. **Exibição:** Arredondamento final apenas no momento do consumo (`CalcAUDOutput` class).

## 2. Lazy Rounding & Caching

Ao chamar `.commit(2)`, o usuário recebe uma instância de `CalcAUDOutput`. Neste momento, **nenhum arredondamento foi feito ainda**.

O cálculo pesado (`applyRounding` + `formatBigIntToString`) é executado apenas quando o primeiro método de leitura é chamado (ex: `toString()`).

- **Cache:** O resultado (bigint arredondado e string formatada) é armazenado em `_cachedStringValue` e `_cachedCentsValue`.
- **Benefício:** Se o usuário chamar `toMonetary()`, `toLaTeX()` e `toVerbalA11y()` em sequência, o algoritmo de arredondamento NBR-5891 roda apenas uma vez.

## 3. Formatos de Saída Suportados

### A. Numéricos e Estruturais

- `toString()`: "1050.00" (Padrão para DBs decimais).
- `toFloatNumber()`: `1050.00` (Number JS - Cuidado com perda de precisão).
- `toCentsInBigInt()`: `105000n` (Para sistemas que armazenam centavos inteiros).
- `toRawInternalBigInt()`: `10500000000000n` (Valor bruto de 12 casas).

### B. Visuais e Auditáveis

- `toMonetary()`: "R$ 1.050,00" (Usa `Intl.NumberFormat`).
- `toLaTeX()`: `$$ 1000 + 50 = 1050.00 $$` (Renderizável em KaTeX/MathJax).
- `toUnicode()`: `1000 + 50 = 1050.00` (Texto puro).
- `toVerbalA11y()`: "1000 mais 50 é igual a 1050 vírgula 00" (Para leitores de tela).

### C. Binários e Web

- `toHTML()`: HTML com CSS inline contendo o SVG/MathML do KaTeX.
- `toImageBuffer()`: Gera um SVG binário on-the-fly, calculando heuristicamente o `viewBox` para que a fórmula matemática se ajuste perfeitamente à imagem sem cortes.

## 4. Customização (`toCustomOutput`)

Implementamos o padrão **Strategy** para outputs. O usuário pode passar uma função que recebe o contexto bruto (`ICalcAUDCustomOutputContext`) e gera qualquer formato não nativo (ex: XML, Protobuf, CSV customizado).
