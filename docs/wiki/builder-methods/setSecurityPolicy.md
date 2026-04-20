# Método: `setSecurityPolicy()` (Static)

O `setSecurityPolicy()` é a central de comando de segurança da CalcAUY. Ele integra a conformidade com leis de proteção de dados (LGPD/GDPR) com a garantia de integridade forense através de assinaturas digitais.

> **Nota de Engenharia:** Este método é estritamente **estático**. A política deve ser definida na inicialização da aplicação para garantir que todos os cálculos e hidratações sigam o mesmo padrão de segurança e salt.

## ⚙️ Funcionamento Interno

1.  **Proteção de PII (sensitive):** Quando ativado (padrão), valores numéricos são substituídos por `[PII]` em logs técnicos, impedindo o vazamento de dados financeiros.
2.  **Lacre de Integridade (salt):** Define a chave secreta usada no hash BLAKE3. Sem o salt correto, é impossível validar ou reconstruir cálculos persistidos que foram assinados.
> **Nota:** *Caso não seja passado nenhum salt, a lib assumirá arbitrariamente o valor `""` (string vazia), para evitar comportamentos inesperados.*
3.  **Codificação de Assinatura (encoder):** Define o formato final da "assinatura" (hash). Suporta múltiplos formatos para equilibrar performance e legibilidade.

## 🛠️ Opções da Política

| Opção | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `sensitive` | `boolean` | `true` | Se `true`, oculta valores reais nos logs de telemetria. |
| `salt` | `string` | `""` | Chave secreta global para geração de assinaturas de integridade. |
| `encoder` | `string` | `"BASE58"` | Formato do hash: `HEX`, `BASE64`, `BASE58` ou `BASE32`. |

### Por que Hexadecimal por padrão?
O **HEX** foi escolhido como padrão por ser um padrão mundial: ele possui implementações consistentes em todas as linguagens usuais, além dos principais databases terem táticas de otimização esse padrão, facilitando a persistência e transporte de dados entre sistemas sistemas.

## 💼 Casos de Uso e Exemplos

### 1. Configuração Padrão de Produção
Garante privacidade total e integridade assinada em Hexadecimal.
```typescript
CalcAUY.setSecurityPolicy({
  sensitive: true,
  salt: Deno.env.get("CALC_SALT") || "segredo-de-estado",
  encoder: "HEX"
});
```

### 2. Debug em Ambiente de Desenvolvimento
Libera os valores nos logs para facilitar a depuração matemática.
```typescript
CalcAUY.setSecurityPolicy({
  sensitive: false, // Mostra os números nos logs
  salt: "dev-key"
});
```

### 3. Integração sob medida
Alteração do encoder para melhor alinhamento com o contexto da aplicação.
```typescript
CalcAUY.setSecurityPolicy({
  salt: "legacy-audit-key",
  encoder: "BASE64"
});
```

## 🛡️ Controle Granular via Metadado `pii`

A política `sensitive` pode ser ignorada localmente em nós específicos através do metadado `pii: boolean`.

- **`.setMetadata("pii", true)`**: Força a ocultação deste nó, mesmo que o sistema esteja em modo debug.
- **`.setMetadata("pii", false)`**: Revela este nó (ex: uma taxa de juros pública) mesmo que o sistema esteja em modo sensível.

## 🏗️ Anotações de Engenharia
- **Assincronia:** Devido ao uso de `crypto.subtle` para o BLAKE3, operações como `.commit()` e `.hibernate()` tornam-se assíncronas ao ativar a segurança.
- **Determinismo:** A engine utiliza **k-sort** recursivo antes de assinar, garantindo que o mesmo cálculo com os mesmos metadados gerem a mesma assinatura, independentemente da ordem de inserção dos metadados.
- **Não-Repúdio:** O uso do `salt` garante que um rastro de auditoria não possa ser forjado por alguém sem acesso às chaves do servidor.
