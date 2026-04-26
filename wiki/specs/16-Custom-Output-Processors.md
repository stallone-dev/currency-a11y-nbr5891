# 16 - Processadores de Saída Customizados (Extensibilidade)

```mermaid
flowchart LR
    AST[AST Tree] --> Manager[toCustomOutput]
    Manager --> UserFn["Custom Processor (fn)"]
    UserFn --> Output[Protobuf / XML / ...]
```

## Objetivo
Prover um mecanismo de "Injeção de Lógica de Saída" que permita à CalcAUY suportar qualquer formato de exportação (Protobuf, XML, Excel, JSON-LD, etc.) sem sobrecarregar o core da biblioteca.

## 1. A Interface Funcional (`CalcAUYCustomOutput`)

O coração da extensibilidade é um tipo funcional genérico que permite ao desenvolvedor definir o contrato de retorno.

```typescript
export type CalcAUYCustomOutput<Toutput> = (
  this: CalcAUYOutput,
  context: CalcAUYCustomOutputContext
) => Toutput;
```

## 2. O Contexto de Dados (`CalcAUYCustomOutputContext`)

Diferente da versão anterior que passava apenas um BigInt escalado, o novo contexto fornece acesso à precisão absoluta do `RationalNumber` e à estrutura completa da AST.

### Estrutura do Contexto
- **`result: RationalNumber`**: O valor final do cálculo (numerador/denominador puros).
- **`ast: CalculationNode`**: A árvore completa para reconstrução customizada.
- **`roundStrategy: RoundingStrategy`**: A estratégia definida no `commit`.
- **`audit`: Objeto contendo os rastros pré-gerados:
  - `latex: string`
  - `unicode: string`
  - `verbal: string`
- **`options: Readonly<OutputOptions>`**: Configurações de locale, moeda e precisão ativa.
- **`methods`**: Um objeto contendo referências aos métodos padrão da classe `CalcAUYOutput` (`toString`, `toMonetary`, etc.), permitindo que o processador customizado reutilize a lógica interna para compor sua saída.

## 3. Regras de Implementação e Rigor

1. **Imutabilidade Estrita**: O `context` deve ser tratado como `Readonly`. Qualquer tentativa de modificar o `RationalNumber` ou a `AST` dentro do processador deve ser impossibilitada pelo sistema de tipos e pela proteção de runtime (`#private`).
2. **Genericidade Plena**: O método `.toCustomOutput<T>()` deve preservar o tipo `T` retornado pelo processador, garantindo Type Safety total no consumo final.
3. **Escopo (`this`)**: O processador deve ser executado no contexto da instância de `CalcAUYOutput`, dando acesso a metadados internos se necessário.

## 4. Exemplo de Implementação: Exportador de Nota Fiscal Eletrônica (XML)

```typescript
const xmlExporter: CalcAUYCustomOutput<string> = (ctx) => {
  const cents = ctx.methods.toScaledBigInt({ decimalPrecision: 2 });
  const valFormatado = ctx.methods.toString({ decimalPrecision: 2 });

  return `
    <imposto roundStrategy="${ctx.roundStrategy}">
      <valor_bruto>${ctx.result.n}/${ctx.result.d}</valor_bruto>
      <valor_fiscal>${valFormatado}</valor_fiscal>
      <centavos_inteiros>${cents}</centavos_inteiros>
      <rastro_latex>${ctx.audit.latex}</rastro_latex>
    </imposto>
  `.trim();
};

// Uso:
const xml = resultado.toCustomOutput(xmlExporter);
```

## 5. Casos de Uso Recomendados
- **Sistemas Legados:** Formatação de strings com preenchimento específico (Fixed-width).
- **Sistemas de Mensageria:** Conversão para buffers binários ou Protobuf.
- **Auditoria Jurídica:** Geração de relatórios com justificativas textuais customizadas baseadas nos metadados da AST.
