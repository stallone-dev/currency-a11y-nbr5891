/**
 * @title Método: CalcAUD.sub()
 * @description Exemplos de subtração de valores, destacando a imutabilidade e a auditoria.
 * @tags sub, arithmetic
 */

import { CalcAUD } from "../../src/main.ts";

function exemploSub() {
    console.log("--- CalcAUD.sub(): Subtração de Valores ---");

    // Exemplo 1: Subtração Simples
    const valorInicial = CalcAUD.from(100);
    const resultadoSimples = valorInicial.sub(25);
    console.log(`1. 100 - 25 = ${resultadoSimples.commit(0).toString()}`); // Saída: 75

    // Exemplo 2: Subtração com Decimais
    const valorDecimal = CalcAUD.from("50.75");
    const resultadoDecimal = valorDecimal.sub("0.50");
    console.log(`2. 50.75 - 0.50 = ${resultadoDecimal.commit(2).toString()}`); // Saída: 50.25

    // Exemplo 3: Subtração Encadeada e Imutabilidade
    const inicioCadeia = CalcAUD.from(200);
    const passo1 = inicioCadeia.sub(50); // 150
    const passo2 = passo1.sub(10); // 140

    console.log(`3. 200 - 50 - 10 = ${passo2.commit(0).toString()}`); // Saída: 140
    console.log(`   Valor inicial (inalterado): ${inicioCadeia.commit(0).toString()}`); // Saída: 200

    // Exemplo 4: Subtração de um valor negativo (efetivamente uma adição)
    const comNegativo = CalcAUD.from(30).sub(-5);
    console.log(`4. 30 - (-5) = ${comNegativo.commit(0).toString()}`); // Saída: 35
    console.log(`   Auditoria LaTeX: ${comNegativo.commit(0).toLaTeX()}`); // Saída: $$ 30 - (-5) = 35 $$

    // Exemplo 5: Subtração de uma expressão complexa
    const orcamento = CalcAUD.from(1000);
    const custosFixos = CalcAUD.from(150).add(200); // 350
    const restante = orcamento.sub(custosFixos);
    console.log(`5. 1000 - (150 + 200) = ${restante.commit(0).toString()}`); // Saída: 650
    console.log(`   Auditoria Verbal: ${restante.commit(0).toVerbalA11y()}`); // Saída: ... 1000 menos em grupo, 150 mais 200, fim do grupo é igual a 650 ...
}

exemploSub();
