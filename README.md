<div align="center">

# CalcAUY

**Infraestrutura de Cálculo AST para Engenharia Financeira e Acessibilidade Digital**

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-2b3a42?style=for-the-badge)](https://opensource.org/licenses/MPL-2.0)
[![JSR](https://img.shields.io/badge/JSR-F7DF1E?style=for-the-badge&logo=jsr&logoColor=000)](https://jsr.io/@seu-escopo/seu-pacote)
[![Made in Brazil](https://img.shields.io/badge/Made_in-Brazil-009739?style=for-the-badge)](https://github.com/topics/brazil)

</div>

A **CalcAUY** é uma infraestrutura em **TypeScript** projetada para neutralizar a imprecisão do padrão IEEE 754. Através de **imutabilidade estrita e Árvore de Sintaxe Abstrata (AST)**, ela assegura a integridade atuária, transformando cada operação em uma evidência matemática transparente, acessível e auditável

---

## 📖 Documentação

- [Entendendo a CalcAUY](./docs/start.md)
- [Exemplos de uso](./docs/examples.md)
- [Especificações](./docs/specs.md)
- [Segurança e Auditabilidade](./docs/audit.md)

## 🚀 Quick-start

### Instalação:
```bash
deno    add jsr:@st-all-one/calc-auy
pnpm      i jsr:@st-all-one/calc-auy
yarn    add jsr:@st-all-one/calc-auy
vlt install jsr:@st-all-one/calc-auy
npx     jsr add @st-all-one/calc-auy
bunx    jsr add @st-all-one/calc-auy
```

### Execução:
```ts
import { CalcAUY } from "@st-all-one/calc-auy";

// ==== Cálculo de Juros Compostos M = C * (1 + i)^t ====
// Parâmetros
const capital = CalcAUY.from("1000.00");
const taxaAnual = CalcAUY.from("0.10"); // 10% a.a.
const anosDecorridos = 3;

// Cálculo matemático M = C * (1 + i)^t
const calcMontante = capital.mult(
    CalcAUY.from(1)
        .add(taxaAnual)
        .group()
        .pow(anosDecorridos),
);

// Colapso da AST ==> realização do cálculo
const resultado = calcMontante.commit({ roundStrategy: "NBR5891" });

// Diferentes visualizaçõe do resultado
const monetario = resultado.toMonetary();
const scaledBigInt = resultado.toScaledBigInt({ decimalPrecision: 2 });
const unicode = resultado.toUnicode();
const latex = resultado.toLaTeX();
const verbalA11y = resultado.toVerbalA11y({ locale: "fr-FR" });
const auditTrace = resultado.toAuditTrace();

console.log(monetario);     // "R$ 1.331,0000"
console.log(scaledBigInt); // 133100n

console.log(unicode);       // "roundₙᵦᵣ₋₅₈₉₁(1000.00 × ((1 + (0.10))³), 4) = 1331.0000"
console.log(latex);         // "\text{round}_{\text{NBR-5891}}(1000.00 \times \left( \left( 1 + \left( 0.10 \right) \right)^{3} \right), 4) = 1331.0000"

console.log(verbalA11y);    // "1000.00 multiplié par ouvrir la parenthèse ouvrir la parenthèse 1 plus ouvrir la parenthèse 0.10 fermer la parenthèse fermer la parenthèse puissance 3 fermer la parenthèse est égal à 1331 virgule 0000 (Arrondi: NBR-5891 pour 4 décimales)."

console.log(auditTrace);
/*
{"ast":{"kind":"operation","type":"mul","operands":[{"kind":"literal","value":{"n":"1000","d":"1"},"originalInput":"1000.00"},{"kind":"group","child":{"kind":"operation","type":"pow","operands":[{"kind":"group","child":{"kind":"operation","type":"add","operands":[{"kind":"literal","value":{"n":"1","d":"1"},"originalInput":"1"},{"kind":"group","child":{"kind":"literal","value":{"n":"1","d":"10"},"originalInput":"0.10"}}]}},{"kind":"literal","value":{"n":"3","d":"1"},"originalInput":"3"}]}}]},"finalResult":{"n":"1331","d":"1"},"strategy":"NBR5891"}
*/
```

### Showcase

Veja em execução no [Showcase Interativo](https://google.com)

## 🎯 Por que a CalcAUY existe?

No desenvolvimento de softwares modernos, o uso do padrão **IEEE 754** (number/float) introduz um risco sistêmico. Erros de arredondamento binário, como o clássico `0.1 + 0.2 !== 0.3`, não são meras curiosidades matemáticas; em escala, transformam-se em rombos financeiros, falhas de compliance e passivos jurídicos.

A `CalcAUY` busca neutralizar essa imprecisão ao tratar o cálculo como um **artefato de engenharia persistente e auditável**.

### Engenharia Matemática

- **Precisão Racional**: Baseada em `BigInts`, a lib opera puramente com frações exatas `(n/d)`. Executando simplificação via **Algoritmo de Stein** (Binary GCD) em cada etapa, garantindo que a memória seja otimizada sem sacrificar o rigor matemático.

- **Precedência Rigorosa**: Implementa o padrão `PEMDAS/BODMAS`, tratando a exponenciação com **Associatividade à Direita** e garantindo que o agrupamento léxico proteja a ordem das operações conforme a intenção do cálculo.

- **Auditabilidade Forense via AST**: Toda operação constrói uma `Árvore de Sintaxe Abstrata (AST) imutável`. Isso permite "hibernar" cálculos complexos em JSON e reidratá-los sem perda de contexto, preservando a intenção original do cálculo.

- **Segurança por Design**: Opera sob o dogma de `Security by Default`, com redação automática de dados sensíveis (`PII`) em logs estruturados. A engine é protegida por gatekeepers estruturais que validam **estritamente** cada input, neutralizando vetores de ataque como `JSON Bombs` e `Stack Overflow`.

- **Integridade Atuária**: Implementação estrita da `NBR 5891` e algoritmos de `Resto de divisão Euclidiana` e `Maior Resto` para rateios monetários exatos, garantindo que nenhum centavo seja perdido ou tendenciado.

### Developer Experience (DX), Portabilidade e Escalabilidade

- **Tipagem Estrita**: Desenvolvida sob o `Strict Mode máximo` do TypeScript, a lib utiliza `Type Guards` e campos privados para garantir que a integridade dos dados seja mantida do código à transpilação.

- **Agnosticismo de Runtime**: Distribuída via `JSR`, a biblioteca é nativamente compatível com `Deno`, `Node.js`, `Bun` e `Cloudflare Workers`. Sem dependências pesadas, ela mantém um rastro zero de IO, operando puramente em memória.

- **Interoperabilidade Total**: Através do sistema de `Custom Output Processors`, a lib é extensível para suportar qualquer formato de saída (Protobuf, XML, Excel) sem inflar o núcleo do projeto.

- **Processamento em Lotes**: O utilitário `processBatch` permite processar volumes massivos de transações (ex: 100.000 cálculos) sem congelar o servidor, utilizando a API `scheduler.yield()` para equilibrar o Throughput e a Responsividade.

### Acessibilidade (A11y) e Universalidade

- **Matemática Acessível**: A `CalcAUY` transforma a AST em diferentes representações visuais e integrativas, como narrações verbais em 8 idiomas (`toVerbalA11y`), unicode para CLIs (`toUnicode`), LaTeX para relatórios (`toLaTeX`), HTML via KaTeX (`toHTML`), AST serializada para auditoria profunda (`toAuditTrace`) e diversos outros outputs, garantindo que cada cálculo possa ser lido por pessoas, máquinas e leitores de tela.

---

<div align="center">

**A CalcAUY é a ferramenta para o engenheiro que não aceita resultados sem provas auditáveis**

<details>
<summary><b>🔍 Testes </b></summary>

<div align="left">
    
**📊 Code Coverage**
> ```bash
> // 2026-04-09
> deno task coverage:report
>
> ok | 17 passed (228 steps) | 0 failed (40s)
> 
> | File                               | Branch % | Function % | Line % |
> | ---------------------------------- | -------- | ---------- | ------ |
> | mod.ts                             |    100.0 |      100.0 |  100.0 |
> | src/ast/builder_utils.ts           |    100.0 |      100.0 |  100.0 |
> | src/ast/engine.ts                  |     97.6 |      100.0 |   97.5 |
> | src/builder.ts                     |     95.8 |      100.0 |   96.6 |
> | src/core/constants.ts              |    100.0 |      100.0 |  100.0 |
> | src/core/errors.ts                 |    100.0 |      100.0 |  100.0 |
> | src/core/metadata.ts               |    100.0 |      100.0 |  100.0 |
> | src/core/rational.ts               |     92.0 |      100.0 |   94.6 |
> | src/i18n/i18n.ts                   |     50.0 |      100.0 |  100.0 |
> | src/output.ts                      |     93.0 |      100.0 |   98.2 |
> | src/output_internal/image_utils.ts |     75.0 |      100.0 |   96.6 |
> | src/output_internal/renderer.ts    |     93.1 |      100.0 |   82.5 |
> | src/output_internal/slicer.ts      |     69.2 |      100.0 |   87.8 |
> | src/parser/lexer.ts                |     83.7 |      100.0 |   81.8 |
> | src/parser/parser.ts               |     90.2 |      100.0 |   93.6 |
> | src/rounding/rounding.ts           |     88.9 |      100.0 |   90.5 |
> | src/utils/batch.ts                 |     77.8 |      100.0 |   88.5 |
> | src/utils/logger.ts                |    100.0 |      100.0 |  100.0 |
> | src/utils/sanitizer.ts             |    100.0 |      100.0 |  100.0 |
> | src/utils/unicode.ts               |     75.0 |      100.0 |  100.0 |
> | All files                          |     92.7 |      100.0 |   95.4 |
> ```

**🛡️ Code Quality (SonarQube)**
> IMG
> 
> Link, 2026-04-xx

**📛 Stress Test**
> ```bash
> // 2026-04-09
> deno test tests/stress.test.ts
> 
> ┌───────────────────────────────┬──────────────────────────────────────────┐
> │ (idx)                         │ Values                                   │
> ├───────────────────────────────┼──────────────────────────────────────────┤
> │ 1_cpu_limit_complex_root      │ "4.5216ms"                               │
> │ 2_extensive_ast_depth         │ "9.6443ms"                               │
> │ 3_costly_repeated_pow         │ "6515.6680ms (iterations: 100000)"       │
> │ 4_simple_real_repeated        │ "3560.0605ms (iterations: 100000)"       │
> │ 5_metadata_cloning_stress     │ "76.7173ms (metadata_keys: 1000)"        │
> │ 6_rational_explosion_gcd      │ "0.7545ms"                               │
> │ 7_slicing_massacre            │ "66.1110ms (slices: 100000)"             │
> │ 8_burst_concurrency_ddos      │ "4139.5395ms (concurrent_tasks: 100000)" │
> │ 9_batch_processing_controlled │ "4058.4680ms (total_tasks: 100000)"      │
> │ 10_logging_policy_race_stress │ "1166.6012ms (errors: 0)"                │
> │ 11_bigint_limit_torture       │ "0.7607ms (caught_overflow: true)"       │
> │ 12_malicious_json_hydration   │ "1.2498ms (deflected: true)"             │
> └───────────────────────────────┴──────────────────────────────────────────┘
> ```

</div>

</details>

---

-- A **CalcAUY** é um projeto de código aberto sob a licença **MPL-2.0** --

</div>
