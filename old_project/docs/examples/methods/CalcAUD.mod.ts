/**
 * @title Método: CalcAUD.mod()
 * @description Exemplos de cálculo de módulo (resto da divisão) com as estratégias Euclidiana e Truncada.
 * @tags mod, arithmetic, remainder, euclidean, truncate
 */

import { CalcAUD } from "../../src/main.ts";

function exemploMod() {
    console.log("--- CalcAUD.mod(): Módulo (Resto da Divisão) ---");

    // Exemplo 1: Módulo Positivo (mesmo resultado para ambas as estratégias)
    // 10 % 3 = 1
    const posModEuclidean = CalcAUD.from(10).mod(3);
    const posModTruncated = CalcAUD.from(10).mod(3, "truncated");
    console.log(`1. 10 % 3 (Euclidiana): ${posModEuclidean.commit(0).toString()}`); // Saída: 1
    console.log(`   10 % 3 (Truncada): ${posModTruncated.commit(0).toString()}`); // Saída: 1
    console.log(`   Auditoria LaTeX (Euclidiana): ${posModEuclidean.commit(0).toLaTeX()}`);

    // Exemplo 2: Módulo com valor negativo (Diferença entre estratégias)
    // -10 % 3
    // Euclidiana: 2 (resto sempre positivo)
    // Truncada: -1 (segue o sinal do dividendo)
    const negModEuclidean = CalcAUD.from(-10).mod(3);
    const negModTruncated = CalcAUD.from(-10).mod(3, "truncated");
    console.log(`2. -10 % 3 (Euclidiana): ${negModEuclidean.commit(0).toString()}`); // Saída: 2
    console.log(`   -10 % 3 (Truncada): ${negModTruncated.commit(0).toString()}`); // Saída: -1
    console.log(`   Auditoria Verbal (Truncada): ${negModTruncated.commit(0).toVerbalA11y()}`);

    // Exemplo 3: Módulo com divisor negativo
    // 10 % -3
    // Euclidiana: -2 (resto com o sinal do divisor, para que q*n + r = a)
    // Truncada: 1 (segue o sinal do dividendo)
    const posByNegEuclidean = CalcAUD.from(10).mod(-3);
    const posByNegTruncated = CalcAUD.from(10).mod(-3, "truncated");
    console.log(`3. 10 % -3 (Euclidiana): ${posByNegEuclidean.commit(0).toString()}`); // Saída: -2
    console.log(`   10 % -3 (Truncada): ${posByNegTruncated.commit(0).toString()}`); // Saída: 1

    // Exemplo 4: Tratamento de módulo por zero (lança CalcAUDError)
    try {
        CalcAUD.from(10).mod(0);
    } catch (e: any) {
        console.log(`4. Erro esperado para 10 % 0: ${e.title}`); // Saída: Operação Matemática Inválida
        console.log(`   Detalhe: ${e.detail}`);
    }
}

exemploMod();
