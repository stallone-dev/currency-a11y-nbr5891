# CalcAUD: Segurança e Parsing

**Arquivo de Origem:** `src/internal/parser.ts`

## 1. Filosofia "Strict Parsing"

A `CalcAUD` adota uma política de **rejeição por padrão**. Se uma string de entrada não corresponder _exatamente_ a um formato numérico conhecido e seguro, ela é rejeitada. Não tentamos "adivinhar" ou limpar inputs sujos (exceto underscores `_` como separadores visuais).

### Formatos Aceitos

O parser utiliza Expressões Regulares (Regex) ancoradas (`^...$`) para validar:

1. **BigInt Literal:** `100n`, `-50n` (Formato nativo do JS).
2. **Inteiros/Decimais:** `10`, `10.5`, `-0.5` (Ponto como separador decimal obrigatório).
3. **Fração:** `1/3`, `-2/5` (Num/Den).
4. **Científico:** `1.5e-2`, `1e10` (Mantissa + Expoente).

## 2. Sanitização de Entrada

- **Separadores de Milhar:** Não são suportados (ex: `1,000`). Isso evita ambiguidade entre vírgula decimal (Brasil/Europa) e separador de milhar (EUA). O usuário deve limpar a string antes de passar para a lib.
- **Underscores:** Permitidos como açúcar sintático (ex: `1_000_000`), removidos antes do processamento.

## 3. Prevenção de Negação de Serviço (DoS)

### A. Ataque de Expoente

Um usuário malicioso poderia enviar `1e1000000`. Se convertêssemos isso cegamente para BigInt ou alocássemos memória proporcional, o processo travaria.

- **Mitigação:** O parser científico calcula o tamanho resultante _antes_ da alocação. Embora o BigInt suporte números arbitrários, o tempo de execução é limitado pelo stack de operações subsequentes.

### B. Ataque de Fração Complexa

Enviar `1/999999999999...` força uma divisão custosa.

- **Mitigação:** A operação de divisão de fração é executada com a precisão fixa de 12 casas. O custo é constante relativo à precisão, não ao tamanho do denominador.

### C. Rate Limit (Demo)

Na camada de demonstração (`demo/logic/rate_limit.ts`), implementamos um limitador de requisições por IP em memória para proteger o servidor público de abuso computacional.

## 4. Tratamento de Erros

Todos os erros de parsing lançam `CalcAUDError` com `type: "invalid-numeric-format"`. Isso permite que sistemas consumidores identifiquem a falha como erro de entrada (400 Bad Request) e não erro interno (500).
