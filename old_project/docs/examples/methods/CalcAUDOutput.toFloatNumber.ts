/**
 * @title Método: CalcAUDOutput.toFloatNumber()
 * @description Exemplos de como converter o resultado arredondado para um tipo Number JavaScript.
 * @tags toFloatNumber, output, precision
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToFloatNumber() {
    console.log("--- CalcAUDOutput.toFloatNumber(): Conversão para Number ---");

    // Exemplo 1: Conversão Simples
    const calc = CalcAUD.from(123.45);
    const output = calc.commit(2);
    console.log(`1. Valor '123.45' como Number: ${output.toFloatNumber()}`); // Saída: 123.45

    // Exemplo 2: Perda de Precisão para valores muito grandes
    // CalcAUD mantém internamente 12 casas de precisão para 1 bilhão.
    const valorGrande = CalcAUD.from("1234567890.123456789123");
    const outputGrande = valorGrande.commit(12);

    console.log(`2. Valor grande como String: ${outputGrande.toString()}`);
    console.log(`   Valor grande como Number: ${outputGrande.toFloatNumber()}`);
    // Saída Number será: 1234567890.1234568 (precisão limitada do float)

    // Exemplo 3: Perda de Precisão para dízimas
    const dizima = CalcAUD.from(1).div(3);
    const outputDizima = dizima.commit(6); // 0.333333
    console.log(`3. 1/3 como String (6 casas): ${outputDizima.toString()}`);
    console.log(`   1/3 como Number: ${outputDizima.toFloatNumber()}`);
    // Saída Number será: 0.333333 (pode variar ligeiramente dependendo do ambiente)

    // Exemplo 4: Uso em operações que exigem Number (ex: APIs externas)
    // Se uma API espera um 'number', CalcAUD facilita a conversão, mas o dev deve estar ciente da precisão.
    const apiCall = (val: number) => `Chamando API com valor: ${val}`;
    const valorParaAPI = CalcAUD.from("50.25");
    console.log(`4. ${apiCall(valorParaAPI.commit(2).toFloatNumber())}`); // Saída: Chamando API com valor: 50.25
}

exemploToFloatNumber();
