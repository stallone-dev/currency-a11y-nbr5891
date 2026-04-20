# Especificação Técnica 17: Política de Proteção de PII e Integridade

A CalcAUY implementa um sistema de proteção de dados sensíveis (Personally Identifiable Information) e integridade forense em camadas, garantindo conformidade com LGPD/GDPR e auditabilidade militar.

## Camada 1: Política Global (`setSecurityPolicy`)

O controle mestre da biblioteca é feito através do método estático global.

-   **Método:** `CalcAUY.setSecurityPolicy(config: { sensitive?: boolean, salt?: string, encoder?: SignatureEncoder })`
-   **Configuração Padrão:** `{ sensitive: true, salt: "", encoder: "HEX" }`

### Comportamento da Redação (sensitive: true)
Quando ativado, os utilitários de log e erro (`sanitizeAST`, `sanitizeObject`) substituem automaticamente:
1.  **Valores Numéricos:** O numerador (`n`) e denominador (`d`) são substituídos pela string `[PII]`.
2.  **Input Original:** O campo `originalInput` é ofuscado.
3.  **Metadados:** Todos os metadados são removidos do rastro de log, a menos que o nó permita a liberação.

### Lacre Digital (salt e encoder)
A definição do `salt` é incorporada a geração de assinaturas BLAKE3 no `commit()` e `hibernate()`.
*   **Não-Repúdio:** O rastro de auditoria é selado matematicamente.
*   **HEX:** Encoder padrão para transporte seguro e otimizado.

## Camada 2: Controle Granular via Metadata (`pii`)

O desenvolvedor pode marcar nós individuais da AST para forçar ou liberar a visibilidade, independente da política global.

-   **Ocultação Forçada:** `.setMetadata("pii", true)` - Garante que o dado NUNCA apareça em logs, mesmo em ambiente de dev.
-   **Liberação de Visibilidade:** `.setMetadata("pii", false)` - Permite que constantes públicas (ex: alíquota de 18%) apareçam nos logs técnicos para facilitar o debug, mesmo em produção.

---

## Exemplo de Fluxo Seguro

```typescript
// 1. Bloqueio global
CalcAUY.setSecurityPolicy({ sensitive: true, salt: "secret-key" });

// 2. Cálculo com dados sensíveis (Ocultos no log)
const fatura = CalcAUY.from("1500.50").setMetadata("client_id", "USR-99");

// 3. Taxa pública (Liberada no log)
const imposto = CalcAUY.from("0.18").setMetadata("pii", false);

const final = await fatura.mult(imposto).commit();
// Logs técnicos mostrarão a operação de MULT, mas esconderão o valor 1500.50.
```
