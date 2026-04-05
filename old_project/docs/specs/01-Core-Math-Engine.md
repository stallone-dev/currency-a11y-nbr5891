# CalcAUD: Especificação da Engine Matemática

**Arquivo de Origem:** `src/internal/math_utils.ts`

## 1. Princípio Fundamental: Ponto Fixo com BigInt

A `CalcAUD` opera sob o paradigma de que **dinheiro é um inteiro discreto**. Em vez de tentar representar frações decimais infinitas (como $1/3 = 0.333...$), escalamos todos os valores por um fator $S = 10^{12}$.

### Equação de Representação

$$ V_{internal} = V_{real} \times 10^{12} $$

- Exemplo: R$ 10,50
- Representação Real: 10.5
- Representação Interna: `10500000000000n`

Isso permite que operações de adição, subtração e multiplicação sejam isomórficas à aritmética inteira padrão, com ajuste de escala apenas na multiplicação e divisão.

## 2. Algoritmos Especiais

Como o `BigInt` nativo do JavaScript não suporta logaritmos ou raízes, implementamos algoritmos numéricos clássicos adaptados para inteiros.

### A. Exponenciação Inteira (`calculateBigIntPower`)

Utiliza o algoritmo de **Exponenciação Binária (Binary Exponentiation)**, também conhecido como _Square-and-Multiply_.

- **Complexidade:** $O(\log n)$
- **Vantagem:** Reduz drasticamente o número de multiplicações necessárias para grandes expoentes.

### B. Raízes N-ésimas (`calculateNthRoot`)

Implementamos uma abordagem híbrida para calcular $\lfloor \sqrt[n]{x} \rfloor$:

1. **Estimativa Inicial:** Usamos `getBitLengthFast` para estimar a magnitude do número e chutar um valor inicial próximo da resposta ($2^{\lceil \text{bits}/n \rceil}$).
2. **Motor Newton-Raphson (para $n \le 10$):**
   - Iteração rápida com convergência quadrática.
   - Fórmula: $x_{k+1} = \frac{1}{n} \left( (n-1)x_k + \frac{A}{x_k^{n-1}} \right)$
   - Ideal para raízes quadradas e cúbicas comuns em juros.
3. **Motor Busca Binária (para $n > 10$):**
   - Utilizado para índices altos onde Newton-Raphson pode oscilar ou ser instável com inteiros.
   - Garante convergência monótona e segura.

### C. Potência Fracionária (`calculateFractionalPower`)

Para calcular $x^{a/b}$ (ex: juros compostos com tempo fracionado), não podemos converter para float.

- **Fórmula:** $\sqrt[b]{x^a}$
- **Ajuste de Escala:** Como estamos operando em ponto fixo, a fórmula real deve compensar a escala $S$:
  $$ Result = \sqrt[b]{\frac{V^a}{S^{a-b}}} $$
  (Simplificação da lógica interna para evitar overflow/underflow prematuro).

## 3. Segurança Matemática

- **Divisão por Zero:** Lança `CalcAUDError` imediatamente.
- **Raiz Par de Negativo:** Bloqueada (não suportamos números complexos).
- **Expoente Negativo Inteiro:** Bloqueado (resultaria em frações menores que 1, exigindo inversão da lógica de escala, atualmente não escopada para o core de inteiros).
