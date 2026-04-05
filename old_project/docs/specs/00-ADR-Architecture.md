# ADR-001: Arquitetura de Precisão Arbitrária e Auditoria em CalcAUD

**Status:** Aceito
**Data:** 25 de Março de 2026
**Contexto:** Cálculos Financeiros Críticos e Auditoria Fiscal

## 1. Contexto e O Problema

No desenvolvimento de software financeiro moderno, a utilização de tipos de ponto flutuante (IEEE 754 `number` em JavaScript/TypeScript) é catastrófica devido a erros de arredondamento inerentes (ex: `0.1 + 0.2 !== 0.3`). Além disso, sistemas fiscais exigem não apenas o resultado correto, mas a **rastreabilidade** de como o resultado foi obtido (quais operações, qual ordem, qual método de arredondamento).

## 2. Decisão Arquitetural

Decidimos implementar a `CalcAUD` (Calculator with Audit) baseada em três pilares fundamentais:

### A. Aritmética de Inteiros com Escala Fixa (BigInt)

Em vez de bibliotecas de `Decimal` lento ou `number` impreciso, utilizamos o tipo primitivo `BigInt` com um **Fator de Escala Interno de $10^{12}$**.

- **Por que 12 casas?** O padrão financeiro exige 2 a 4 casas. 6 casas é o padrão de _display_. 12 casas permitem realizar múltiplas operações de multiplicação e divisão em cadeia (até 8 camadas de profundidade) acumulando erros de arredondamento na ordem de $10^{-12}$, que são matematicamente irrelevantes ao truncar para a saída final de 2 ou 4 casas.
- **Performance:** Operações com `BigInt` são significativamente mais rápidas que objetos de bibliotecas de terceiros (como `decimal.js`), pois são otimizadas na engine V8.

### B. Imutabilidade Estrita

A classe `CalcAUD` é imutável.

- Cada operação (`add`, `sub`, `div`, etc.) retorna uma **nova instância**.
- Isso previne efeitos colaterais (side-effects) em cálculos complexos e permite o "time-traveling" de estados se necessário.

### C. Motor de Auditoria Híbrido (Léxico + Semântico)

Diferente de calculadoras comuns, a `CalcAUD` não armazena apenas o número. Ela mantém, em paralelo, três árvores de representação:

1. **Valor Matemático:** O `bigint` bruto.
2. **Árvore LaTeX:** Para renderização visual científica (`$$ a + b $$`).
3. **Árvore Verbal/A11y:** Tokens semânticos para acessibilidade e internacionalização (`{#ADD#}`).

## 3. Estratégia de "Output Lazy"

Decidimos desacoplar o cálculo da formatação. O arredondamento final (para 2 casas, por exemplo) é uma operação "destrutiva". Portanto:

- O valor interno mantém sempre a precisão máxima (12 casas).
- O arredondamento só ocorre no método `.commit()` ou na chamada de métodos de saída (`toString`, `toMonetary`).
- **Cache:** Implementamos um _Lazy Cache_ em `src/output.ts`. Se o usuário pede `.toString()` e depois `.toMonetary()`, o cálculo pesado de arredondamento (norma NBR 5891) roda apenas na primeira vez.

## 4. Consequências

### Positivas

- **Precisão Absoluta:** Erros de float eliminados.
- **Auditoria Nativa:** O sistema gera documentação do cálculo automaticamente.
- **Segurança:** Parsers estritos impedem injeção de valores malformados.

### Negativas/Limitações

- **Complexidade de Raízes:** Calcular raízes n-ésimas em `BigInt` exige algoritmos customizados (implementamos Newton-Raphson), o que adiciona peso ao bundle.
- **Overhead de Memória:** Cada passo do cálculo gera novas strings de auditoria, consumindo mais RAM que uma operação numérica simples. (Aceitável dado o contexto de backend/financeiro).
