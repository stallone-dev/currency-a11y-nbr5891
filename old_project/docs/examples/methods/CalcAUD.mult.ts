/**
 * @title Método: CalcAUD.mult()
 * @description Exemplos de multiplicação de valores, incluindo porcentagens e expressões encadeadas.
 * @tags mult, arithmetic
 */

import { CalcAUD } from "../../src/main.ts";

function exemploMult() {
    console.log("--- CalcAUD.mult(): Multiplicação de Valores ---");

    // Exemplo 1: Multiplicação Simples
    const valorBase = CalcAUD.from(25);
    const resultadoSimples = valorBase.mult(4);
    console.log(`1. 25 * 4 = ${resultadoSimples.commit(0).toString()}`); // Saída: 100

    // Exemplo 2: Cálculo de Porcentagem (Valor com Juros)
    const precoOriginal = CalcAUD.from("120.00");
    const taxaJuros = CalcAUD.from("1.10"); // 10% de juros
    const precoComJuros = precoOriginal.mult(taxaJuros);
    console.log(`2. 120.00 * 1.10 = ${precoComJuros.commit(2).toString()}`); // Saída: 132.00

    // Exemplo 3: Multiplicação por Fração (Meio de algo)
    const totalItens = CalcAUD.from(500);
    const metade = CalcAUD.from("1/2");
    const resultadoFracao = totalItens.mult(metade);
    console.log(`3. 500 * 1/2 = ${resultadoFracao.commit(0).toString()}`); // Saída: 250
    console.log(`   Auditoria Unicode: ${resultadoFracao.commit(0).toUnicode()}`); // Saída: 500 × 1/2 = 250

    // Exemplo 4: Multiplicação Encadeada e Imutabilidade
    const inicioCadeia = CalcAUD.from(5);
    const passo1 = inicioCadeia.mult(2); // 10
    const passo2 = passo1.mult(3); // 30

    console.log(`4. 5 * 2 * 3 = ${passo2.commit(0).toString()}`); // Saída: 30
    console.log(`   Valor inicial (inalterado): ${inicioCadeia.commit(0).toString()}`); // Saída: 5

    // Exemplo 5: Multiplicação com valores negativos
    const negativo = CalcAUD.from(10).mult(-2);
    console.log(`5. 10 * (-2) = ${negativo.commit(0).toString()}`); // Saída: -20
}

exemploMult();
