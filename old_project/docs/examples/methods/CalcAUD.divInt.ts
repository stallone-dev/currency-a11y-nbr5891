/**
 * @title Método: CalcAUD.divInt()
 * @description Exemplos de divisão inteira com as estratégias Euclidiana e Truncada.
 * @tags divInt, arithmetic, floor, truncate
 */

import { CalcAUD } from "../../src/main.ts";

function exemploDivInt() {
    console.log("--- CalcAUD.divInt(): Divisão Inteira ---");

    // Exemplo 1: Divisão Inteira Positiva (mesmo resultado para ambas as estratégias)
    // 10 / 3 = 3
    const posDivIntEuclidean = CalcAUD.from(10).divInt(3);
    const posDivIntTruncated = CalcAUD.from(10).divInt(3, "truncated");
    console.log(`1. 10 / 3 (Euclidiana): ${posDivIntEuclidean.commit(0).toString()}`); // Saída: 3
    console.log(`   10 / 3 (Truncada): ${posDivIntTruncated.commit(0).toString()}`); // Saída: 3
    console.log(`   Auditoria LaTeX (Euclidiana): ${posDivIntEuclidean.commit(0).toLaTeX()}`);

    // Exemplo 2: Divisão Inteira com um valor negativo (Diferença entre estratégias)
    // -10 / 3
    // Euclidiana (floor): -4 (pois -3.33 -> -4)
    // Truncada (em direção a zero): -3
    const negDivIntEuclidean = CalcAUD.from(-10).divInt(3);
    const negDivIntTruncated = CalcAUD.from(-10).divInt(3, "truncated");
    console.log(`2. -10 / 3 (Euclidiana): ${negDivIntEuclidean.commit(0).toString()}`); // Saída: -4
    console.log(`   -10 / 3 (Truncada): ${negDivIntTruncated.commit(0).toString()}`); // Saída: -3
    console.log(`   Auditoria Verbal (Truncada): ${negDivIntTruncated.commit(0).toVerbalA11y()}`);

    // Exemplo 3: Divisão Inteira com divisor negativo
    // 10 / -3
    // Euclidiana (floor): -4
    // Truncada (em direção a zero): -3
    const posByNegEuclidean = CalcAUD.from(10).divInt(-3);
    const posByNegTruncated = CalcAUD.from(10).divInt(-3, "truncated");
    console.log(`3. 10 / -3 (Euclidiana): ${posByNegEuclidean.commit(0).toString()}`); // Saída: -4
    console.log(`   10 / -3 (Truncada): ${posByNegTruncated.commit(0).toString()}`); // Saída: -3

    // Exemplo 4: Tratamento de divisão por zero (lança CalcAUDError)
    try {
        CalcAUD.from(10).divInt(0);
    } catch (e: any) {
        console.log(`4. Erro esperado para 10 / 0: ${e.title}`); // Saída: Operação Matemática Inválida
        console.log(`   Detalhe: ${e.detail}`);
    }
}

exemploDivInt();
