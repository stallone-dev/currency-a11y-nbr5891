/**
 * @title Método: CalcAUD.div()
 * @description Exemplos de divisão de valores, incluindo dízimas e tratamento de divisão por zero.
 * @tags div, arithmetic
 */

import { CalcAUD } from "../../src/main.ts";

function exemploDiv() {
    console.log("--- CalcAUD.div(): Divisão de Valores ---");

    // Exemplo 1: Divisão Exata
    const valorBase = CalcAUD.from(100);
    const resultadoExato = valorBase.div(4);
    console.log(`1. 100 / 4 = ${resultadoExato.commit(0).toString()}`); // Saída: 25

    // Exemplo 2: Divisão com Dízima Periódica (alta precisão interna)
    // 10 / 3 = 3.333333333333...
    const comDizima = CalcAUD.from(10).div(3);
    console.log(`2. 10 / 3 (2 casas): ${comDizima.commit(2).toString()}`); // Saída: 3.33
    console.log(`2. 10 / 3 (6 casas): ${comDizima.commit(6).toString()}`); // Saída: 3.333333
    console.log(`   Auditoria LaTeX: ${comDizima.commit(6).toLaTeX()}`);

    // Exemplo 3: Divisão Encadeada e Imutabilidade
    const inicioCadeia = CalcAUD.from(100);
    const passo1 = inicioCadeia.div(2); // 50
    const passo2 = passo1.div(5); // 10

    console.log(`3. 100 / 2 / 5 = ${passo2.commit(0).toString()}`); // Saída: 10
    console.log(`   Valor inicial (inalterado): ${inicioCadeia.commit(0).toString()}`); // Saída: 100

    // Exemplo 4: Divisão por Zero (lança CalcAUDError)
    try {
        CalcAUD.from(10).div(0);
    } catch (e: any) {
        console.log(`4. Erro esperado para 10 / 0: ${e.title}`); // Saída: Operação Matemática Inválida
        console.log(`   Detalhe: ${e.detail}`); // Saída: Tentativa de divisão por zero.
    }

    // Exemplo 5: Divisão com valores negativos
    const negativo = CalcAUD.from(-20).div(4);
    console.log(`5. -20 / 4 = ${negativo.commit(0).toString()}`); // Saída: -5
}

exemploDiv();
