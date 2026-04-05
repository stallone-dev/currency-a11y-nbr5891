/**
 * @title Método: CalcAUDOutput.toRawInternalBigInt()
 * @description Exemplos de como obter o valor bruto interno do BigInt, na escala de 10^12, para auditoria profunda.
 * @tags toRawInternalBigInt, output, bigint, debug
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToRawInternalBigInt() {
    console.log("--- CalcAUDOutput.toRawInternalBigInt(): Valor Bruto Interno ---");

    // Exemplo 1: Valor Simples
    // 100 -> 100 * 10^12 = 100_000_000_000_000n
    const valorSimples = CalcAUD.from(100);
    const outputSimples = valorSimples.commit(0);
    console.log(`1. Valor '100' bruto: ${outputSimples.toRawInternalBigInt()}n`);

    // Exemplo 2: Valor Decimal
    // 1.23 -> 1.23 * 10^12 = 1_230_000_000_000n
    const valorDecimal = CalcAUD.from("1.23");
    const outputDecimal = valorDecimal.commit(2);
    console.log(`2. Valor '1.23' bruto: ${outputDecimal.toRawInternalBigInt()}n`);

    // Exemplo 3: Dízima com alta precisão
    // 1/3 (arredondado internamente)
    const dizima = CalcAUD.from("1/3");
    const outputDizima = dizima.commit(12); // Pede 12 casas para o commit
    console.log(`3. Valor '1/3' (12 casas) bruto: ${outputDizima.toRawInternalBigInt()}n`);
    console.log(`   (toString): ${outputDizima.toString()}`);
    // O valor bruto reflete a precisão de entrada, não a de saída do commit.
    // parseStringValue("1/3") já retorna na escala 10^12.

    // Exemplo 4: Auditoria de Operações (valor interno após cálculos)
    const operacaoComplexa = CalcAUD.from(1).div(3).mult(3); // (1/3) * 3 = 1
    const outputComplexa = operacaoComplexa.commit(0);
    console.log(`4. (1/3)*3 bruto: ${outputComplexa.toRawInternalBigInt()}n`); // Saída: 1_000_000_000_000n (representa 1.000000000000)
    console.log(`   (toString): ${outputComplexa.toString()}`); // Saída: 1

    // Exemplo 5: Debugging de precisão
    // Comparando com toCentsInBigInt para entender as escalas
    const valorDebug = CalcAUD.from("123.456");
    const outputDebug = valorDebug.commit(2); // Arredonda para 123.46

    console.log(`5. Valor '123.456' (commit 2):`);
    console.log(`   toRawInternalBigInt(): ${outputDebug.toRawInternalBigInt()}n`); // Bruto original na escala 12
    console.log(`   toCentsInBigInt(): ${outputDebug.toCentsInBigInt()}n`); // Arredondado para 2 casas, na escala 2 (centavos)
    console.log(`   toString(): ${outputDebug.toString()}`); // String do arredondado
}

exemploToRawInternalBigInt();
