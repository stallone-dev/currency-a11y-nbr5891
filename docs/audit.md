# O Rastro de Confiança: Auditoria e PII

A CalcAUY foi desenhada para que cada centavo possa ser justificado perante um auditor, juiz ou cliente final.

## 1. Justificativa por Nó (`setMetadata`)

Cada operação na AST pode carregar um contexto de negócio. Isso é o que chamamos de **Metadado de Auditoria**.

```ts
const calc = CalcAUY.from(100)
  .add(10).setMetadata("motivo", "Adicional de Periculosidade")
  .add(5).setMetadata("motivo", "Auxílio Alimentação");
```

Ao exportar o `toAuditTrace()`, você obterá um JSON contendo não apenas os números, mas a árvore completa com estas descrições vinculadas a cada passo do cálculo.

## 2. Proteção de PII (Personally Identifiable Information)

Por padrão, a CalcAUY adota o princípio de **Segurança por Padrão**.

### Comportamento dos Logs:
-   **Produção (Default):** Valores numéricos e metadados são substituídos por `[PII]` nos logs de telemetria. Você verá a **estrutura** da conta (adições, multiplicações), mas não os valores reais.
-   **Desenvolvimento:** Você pode liberar os dados para depuração profunda.

### Como controlar:
```ts
// 1. Camada Global: Libera logs para toda a aplicação
CalcAUY.setLoggingPolicy({ sensitive: false });

// 2. Camada Granular: Oculta apenas um nó sensível mesmo com log liberado
CalcAUY.from(cpf_numerico).setMetadata("pii", true);
```

## 3. Formatos de Prova Matemática

Dependendo do seu público, a CalcAUY oferece diferentes "níveis de prova":

| Formato | Público Alvo | Objetivo |
| :--- | :--- | :--- |
| **AuditTrace (JSON)** | Sistemas e Auditores TI | Validação programática do passo a passo. |
| **LaTeX** | Advogados e Engenheiros | Representação matemática padrão em documentos. |
| **Unicode** | Desenvolvedores (Logs) | Visualização rápida no terminal/CLI. |
| **VerbalA11y** | Deficientes Visuais | Garantir que o cálculo é compreensível via áudio. |

## 4. Hibernação e Forense

Se um cálculo for contestado daqui a 5 anos, você não precisa re-executar o código original (que pode ter mudado). Você só precisa ter salvo o retorno do `.hibernate()`.

Ao usar `CalcAUY.hydrate(snapshot)`, você reconstrói a **mesma árvore exata** com os mesmos metadados da época do cálculo original, permitindo uma auditoria forense retroativa perfeita.

---
**Rigor Técnico:** A CalcAUY monitora automaticamente ataques de negação de serviço (DoS) via "JSON Bombs" ou números explosivos, protegendo seu sistema contra entradas mal-intencionadas durante a auditoria.
