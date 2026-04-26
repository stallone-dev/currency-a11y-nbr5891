# Método: `toLiveTrace()`

O `toLiveTrace()` fornece acesso ao rastro completo da execução como um objeto JavaScript "vivo" e tipado para inspeção programática. Ele retorna a mesma estrutura que o [`toAuditTrace()`](./toAuditTrace.md), porém em formato de objeto (JS Object) em vez de string JSON.

## ⚙️ Funcionamento Interno

1.  **Tipagem Rigorosa:** Retorna um objeto que implementa a interface `SerializedCalculation`.
2.  **Shallow Copy:** Realiza uma cópia superficial do nó raiz da AST (nós internos são imutáveis).
3.  **Metadados:** Inclui metadados globais e a assinatura digital BLAKE3.
4.  **Performance:** Resultado cacheado na instância para acessos subsequentes O(1).

## 🎯 Propósito
Permitir que ferramentas de análise, validadores formais e processadores customizados acessem a "alma" do cálculo sem o custo de desserialização do JSON.

## 💼 Exemplos de Uso

```typescript
const res = await calc.commit();
const live = res.toLiveTrace();

console.log(live.signature); // "blake3_hash..."
console.log(live.ast.kind);  // "operation"
```

---

## 🔗 Veja também
- [**Output Interface**](../specs/09-Output-Interface.md)
- [**toAuditTrace**](./toAuditTrace.md)
- [**toCustomOutput**](./toCustomOutput.md)
