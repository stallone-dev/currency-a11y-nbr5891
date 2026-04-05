/**
 * @title Método: CalcAUDOutput.toCentsInBigInt()
 * @description Exemplos de como obter o valor como BigInt na escala de "centavos" (duas casas decimais), útil para DBs.
 * @tags toCentsInBigInt, output, bigint
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToCentsInBigInt() {
    console.log("--- CalcAUDOutput.toCentsInBigInt(): Valor em Centavos ---");

    // Exemplo 1: Valor Positivo
    // 123.45 -> 12345n (para 2 casas decimais)
    const valorPositivo = CalcAUD.from("123.45");
    const outputPositivo = valorPositivo.commit(2);
    console.log(`1. Valor '123.45' como centavos: ${outputPositivo.toCentsInBigInt()}n`); // Saída: 12345n

    // Exemplo 2: Valor com mais casas decimais do que o target
    // 123.456 -> 12346n (arredondado para 2 casas, regra padrão NBR-5891)
    const valorArredondado = CalcAUD.from("123.456");
    const outputArredondado = valorArredondado.commit(2);
    console.log(`2. Valor '123.456' como centavos (arredondado): ${outputArredondado.toCentsInBigInt()}n`); // Saída: 12346n

    // Exemplo 3: Valor Negativo
    // -45.67 -> -4567n
    const valorNegativo = CalcAUD.from("-45.67");
    const outputNegativo = valorNegativo.commit(2);
    console.log(`3. Valor '-45.67' como centavos: ${outputNegativo.toCentsInBigInt()}n`); // Saída: -4567n

    // Exemplo 4: Zero
    const valorZero = CalcAUD.from(0);
    const outputZero = valorZero.commit(2);
    console.log(`4. Valor '0' como centavos: ${outputZero.toCentsInBigInt()}n`); // Saída: 0n

    // Exemplo 5: Uso para armazenamento em Banco de Dados (ex: PostgreSQL `NUMERIC` ou `BIGINT`)
    const transacaoValor = CalcAUD.from("299.99");
    const outputTransacao = transacaoValor.commit(2);
    const valorParaDB = outputTransacao.toCentsInBigInt();
    const moedaDB = outputTransacao.options.currency;
    console.log(`5. Transação para DB: { valor: ${valorParaDB}n, moeda: "${moedaDB}" }`); // Ex: { valor: 29999n, moeda: "BRL" }
}

exemploToCentsInBigInt();
