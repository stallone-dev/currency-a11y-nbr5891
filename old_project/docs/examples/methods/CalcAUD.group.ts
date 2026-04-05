/**
 * @title Método: CalcAUD.group()
 * @description Exemplos de como o agrupamento explícito controla a precedência matemática e a auditoria léxica.
 * @tags group, precedence, audit
 */

import { CalcAUD } from "../../src/main.ts";

function exemploGroup() {
    console.log("--- CalcAUD.group(): Agrupamento de Operações ---");

    // Exemplo 1: Sem Agrupamento (Precedência padrão)
    // 10 + 5 * 2 = 10 + 10 = 20
    const semAgrupamento = CalcAUD.from(10).add(5).mult(2);
    console.log(`1. Sem agrupamento (10 + 5 * 2) = ${semAgrupamento.commit(0).toString()}`); // Saída: 20
    console.log(`   Auditoria LaTeX: ${semAgrupamento.commit(0).toLaTeX()}`); // $$ 10 + 5 	imes 2 = 20 $$

    // Exemplo 2: Com Agrupamento Explícito
    // (10 + 5) * 2 = 15 * 2 = 30
    const comAgrupamento = CalcAUD.from(10).add(5).group().mult(2);
    console.log(`2. Com agrupamento ((10 + 5) * 2) = ${comAgrupamento.commit(0).toString()}`); // Saída: 30
    console.log(`   Auditoria LaTeX: ${comAgrupamento.commit(0).toLaTeX()}`); // $$ \left( 10 + 5  right) 	imes 2 = 30 $$

    // Exemplo 3: Aninhamento de Grupos para Expressões Complexas
    // ((100 - (5 * 2)) + 15) / 5
    const complexoAninhado = CalcAUD.from(100)
        .sub(CalcAUD.from(5).mult(2).group()) // 100 - (5 * 2)
        .add(15)
        .group() // (100 - (5 * 2) + 15)
        .div(5);

    console.log(`3. Complexo aninhado = ${complexoAninhado.commit(0).toString()}`); // Saída: 21
    console.log(`   Auditoria Verbal: ${complexoAninhado.commit(0).toVerbalA11y()}`);

    // Exemplo 4: Agrupamento de um único termo (efeito visual na auditoria)
    const termo = CalcAUD.from(100);
    const termoAgrupado = termo.group();
    console.log(`4. Termo agrupado (LaTeX): ${termoAgrupado.commit(0).toLaTeX()}`); // $$ \left( 100 right) = 100 $$
}

exemploGroup();
