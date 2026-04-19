# Método: `hydrate()` (Static)

O `hydrate()` é o mecanismo de restauração de estado e validação de integridade da CalcAUY. Ele permite reconstruir uma instância funcional do builder a partir de dados serializados (JSON), garantindo a continuidade do cálculo sob um lacre criptográfico digital.

## ⚙️ Funcionamento Interno

1.  **Confronto de Assinatura:** O método extrai a assinatura do JSON e gera um novo hash BLAKE3 a partir dos dados recebidos, utilizando o **Salt** fornecido no segundo parâmetro.
2.  **Proteção contra Tampering:** Se houver qualquer alteração de 1 bit nos dados ou metadados, ou se o Salt for inválido, o método lança um erro fatal de integridade.
3.  **Validação Estrutural:** Após validar a assinatura, a árvore é percorrida recursivamente para garantir que a estrutura é legítima e não contém "bombas lógicas".

## 🎯 Propósito
Recuperar cálculos salvos em bancos de dados ou recebidos via API, garantindo que o que está sendo processado é exatamente o que foi assinado na origem, sem adulterações intermediárias.

## 💼 10 Casos de Uso Reais

### 1. Recuperação de Fluxo de Aprovação
Restaurar um cálculo que foi submetido para análise humana e precisa de um acréscimo final.
```typescript
const approval = await db.get("pending_calc");
// Requer o salt secreto original para validar o que o usuário enviou
const calc = await CalcAUY.hydrate(approval.math_state, { salt: "secret-123" });
const final = await calc.add(50).commit();
```

### 2. Validação Forense de Rastro em Logs
Verificar se um rastro de auditoria extraído de um sistema de log externo foi adulterado por um atacante.
```typescript
try {
  await CalcAUY.hydrate(traceFromLog, { salt: "audit-key-2026" });
  console.log("Cálculo íntegro e autêntico.");
} catch (e) {
  console.error("ALERTA: Rastro de auditoria corrompido!");
}
```

### 3. Sincronização de Estado Server-to-Client
Reconstruir a árvore no front-end para exibir o rastro visual (LaTeX) sem reprocessar a lógica no servidor.
```typescript
// No cliente, hidratando o estado assinado vindo da API
const calc = await CalcAUY.hydrate(apiResponse.logic, { salt: "public-app-salt" });
const visual = (await calc.commit()).toLaTeX();
```

### 4. Retomada de Cálculos de Auditoria (Audit Logs)
Usar o JSON de auditoria para re-executar um cálculo antigo e validar o resultado histórico.
```typescript
const audit = JSON.parse(await Deno.readTextFile("./audit.json"));
const calc = await CalcAUY.hydrate(audit, { salt: "historical-salt" });
const isValid = (await calc.commit()).toRawInternalBigInt() === BigInt(audit.expected);
```

### 5. Arquitetura de Microserviços Distribuídos
O Serviço A constrói a base do cálculo e o Serviço B aplica os impostos finais.
```typescript
// Serviço B recebe o payload assinado do Serviço A
const baseCalc = await CalcAUY.hydrate(payloadFromServiceA, { salt: "inter-service-key" });
const finalRes = await baseCalc.mult("1.15").commit();
```

### 6. Conformidade Regulatória (Não-Repúdio)
Armazenar o rastro assinado em um Ledger para provar a conformidade fiscal anos depois.
```typescript
const ledgerEntry = await db.ledger.findUnique({ where: { id: txId } });
// A hidratação falhará se qualquer metadado da lei aplicada for alterado
const originalCalc = await CalcAUY.hydrate(ledgerEntry.signed_json, { salt: "gov-salt" });
```

### 7. Testes de Regressão com Snapshots
Garantir que mudanças no código da engine não alterem resultados de cálculos complexos salvos em disco.
```typescript
const snapshot = await Deno.readTextFile("./tests/snapshots/complex_deal.json");
const calc = await CalcAUY.hydrate(snapshot, { salt: "test-salt" });
assertEquals((await calc.commit()).toStringNumber(), "1540.22");
```

### 8. Reversão de Estado (Undo/Redo Técnico)
Restaurar uma versão anterior de um cálculo complexo persistida em uma timeline de histórico.
```typescript
const previousState = history.pop();
const restored = await CalcAUY.hydrate(previousState, { salt: "session-key" });
```

### 9. Validação de Fórmulas Submetidas por Usuário
Validar a integridade de uma fórmula complexa enviada via formulário por um operador financeiro.
```typescript
app.post("/calculate", async (req) => {
  // O salt garante que a fórmula foi gerada pela nossa própria UI de builder
  const calc = await CalcAUY.hydrate(req.body.signed_formula, { salt: "ui-secret" });
  return (await calc.commit()).toJSON();
});
```

### 10. Isolamento Multi-tenant (Salts Diferentes)
Garantir que um cliente não possa "sequestrar" o cálculo de outro usando chaves de integridade separadas.
```typescript
const tenant = await getTenantConfig(req.tenantId);
// Cada empresa possui seu próprio Salt secreto
const calc = await CalcAUY.hydrate(req.body.data, { salt: tenant.security_salt });
```

## 🛠️ Opções Permitidas

- `ast`: `CalculationNode | string | object` (O envelope assinado contendo `data` e `signature`).
- `config`: `object`
    - `salt`: `string` (**Obrigatório** - O segredo usado para validar a assinatura).
    - `encoder`: `SignatureEncoder` (Opcional - HEX, BASE64, BASE58, BASE32).

## 🏗️ Anotações de Engenharia
- **Custo Computacional:** A hidratação envolve o parse do JSON e a execução do hash BLAKE3. Em sistemas de alta frequência, recomenda-se o uso de `createCacheSession()`.
- **Segurança de Memória:** O `hydrate()` limita a profundidade da árvore restaurada para evitar ataques de DoS via JSON malformado.
- **Assincronia:** Este método é obrigatoriamente `async` pois depende da Web Crypto API para o confronto da assinatura.
