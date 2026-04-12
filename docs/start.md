# Guia de Início Rápido: O Universo CalcAUY

Bem-vindo à **CalcAUY** (Audit + A11y). Se você trabalha com sistemas financeiros, contábeis ou fiscais, sabe que o tipo `number` do JavaScript é seu maior inimigo. Este guia vai te ensinar a dominar a precisão absoluta em poucos minutos.

## 1. Por que não usar `number`?

No JavaScript/TypeScript padrão:
```ts
console.log(0.1 + 0.2); // 0.30000000000000004 ❌
```
Esse erro de "1 centavo" pode causar prejuízos milionários em faturas ou inconsistências em laudos jurídicos.

**Com CalcAUY:**
```ts
import { CalcAUY } from "calc-auy";

const res = CalcAUY.from(0.1).add(0.2).commit();
console.log(res.toStringNumber()); // "0.30" ✅ (Precisão Racional Exata)
```

## 2. O Momento Mágico (O Rastro)

A CalcAUY não apenas calcula; ela **explica** o cálculo.

```ts
const fatura = CalcAUY.from(1000)
  .add(50).setMetadata("motivo", "Taxa de Entrega")
  .mult("1.10").setMetadata("taxa", "Juros de Mora")
  .commit({ roundStrategy: "NBR5891" });

// 1. O valor para o banco (BigInt em centavos)
console.log(fatura.toScaledBigInt({ decimalPrecision: 2 })); // 115500n

// 2. O rastro para o Laudo Pericial (LaTeX)
console.log(fatura.toLaTeX()); // \text{round}_{NBR}((1000 + 50) * 1.10, 2) = 1155.00

// 3. Acessibilidade para deficientes visuais (Verbal)
console.log(fatura.toVerbalA11y()); // "mil e cinquenta, multiplicado por um vírgula dez..."
```

## 3. Construir vs. Executar (O Conceito de AST)

Diferente de calculadoras comuns, a CalcAUY funciona em duas fases:

1.  **Fase de Build (AST):** Você monta a fórmula. Cada método (`.add`, `.mult`) apenas anexa um "nó" a uma árvore de dados imutável. Nada é calculado ainda. Isso permite anexar metadados e persistir o cálculo.
2.  **Fase de Commit:** O motor percorre a árvore, simplifica as frações matemáticas e gera o resultado final com a estratégia de arredondamento escolhida.

## 4. Próximos Passos

-   **[Casos Reais e Exemplos](./examples.md):** Veja como aplicar em ICMS, Folha de Pagamento e Rateios.
-   **[Guia de Auditoria e PII](./audit.md):** Aprenda a gerar provas matemáticas e proteger dados sensíveis.
-   **[Especificações Técnicas](./specs.md):** Mergulhe nos detalhes matemáticos do nosso motor racional.

---
**Dica de Ouro:** Sempre prefira passar strings numéricas como `"10.50"` para a biblioteca em vez de números puros, garantindo que nenhum erro de precisão entre na engine.
