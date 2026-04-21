# Método: `toRawInternalNumber()`

O `toRawInternalNumber()` retorna o resultado final da árvore de cálculo em sua forma racional mais pura: um objeto contendo o numerador (**n**) e o denominador (**d**) como `BigInt`, sem qualquer tipo de arredondamento ou processamento decimal.

## ⚙️ Funcionamento Interno

1.  **Acesso Direto ao Racional:** O método acessa o resultado interno consolidado (instância de `RationalNumber`) e extrai as propriedades `n` e `d`.
2.  **Zero Processamento:** Diferente de todos os outros métodos de saída, este **ignora** a estratégia de arredondamento definida no `commit()`.
3.  **Simplificação MDC:** O valor retornado é a fração irredutível (simplificada pelo Máximo Divisor Comum), garantindo a menor representação possível daquele fato matemático.

## 🎯 Propósito
Obter a precisão absoluta da engine. É ideal para sistemas que desejam persistir a fração pura para cálculos futuros ou que possuem motores de processamento próprios que operam sobre racionais.

## 💼 Casos de Uso e Exemplos

### 1. Auditoria de Precisão Infinita
Verificar o valor exato de uma dízima periódica sem o limite das 50 casas decimais do rastro textual.
```typescript
const res = await CalcAUY.from(10).div(3).commit();
const { n, d } = res.toRawInternalNumber();
console.log(`${n}/${d}`); // "10/3"
```

### 2. Persistência de Frações Puras
Armazenar numeradores e denominadores em colunas separadas no banco de dados para evitar qualquer erro de conversão decimal.
```typescript
const { n, d } = output.toRawInternalNumber();
await db.raw_values.create({ data: { num: n.toString(), den: d.toString() } });
```

### 3. Integração com Outras Bibliotecas Racionais
Passar o resultado para ferramentas que aceitem objetos racionais customizados.
```typescript
const raw = res.toRawInternalNumber();
const bigRat = new OtherBigRat(raw.n, raw.d);
```

### 4. Validação de Invariantes Matemáticas
Testar se a engine simplificou corretamente uma expressão complexa.
```typescript
const res = await CalcAUY.from("1/2").add("1/4").commit();
const raw = res.toRawInternalNumber();
// 1/2 + 1/4 = 3/4
expect(raw).toEqual({ n: 3n, d: 4n });
```

## 🛠️ Opções Permitidas (`OutputOptions`)

| Opção | Tipo | Descrição | Impacto no Output |
| :--- | :--- | :--- | :--- |
| (Nenhuma) | - | Este método foca na pureza racional. | Ignora parâmetros de precisão ou locale. |

## 💡 Recomendações
- **Use para persistência técnica.** Se o objetivo for exibição para o usuário, prefira `toStringNumber()` ou `toMonetary()`.
- **Cuidado com a magnitude.** Numeradores e denominadores podem crescer consideravelmente em cadeias de multiplicação/exponenciação longas.

## 🏗️ Considerações de Engenharia
- **Fidelidade Total:** Este é o único método que retorna o resultado real do estado final da engine após o colapso da AST.
