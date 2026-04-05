/**
 * @title Método: CalcAUD.add()
 * @description Exemplos de adição de valores, demonstrando a imutabilidade e rastreabilidade.
 * @tags add, arithmetic
 */

import { CalcAUD } from "../../src/main.ts";

function exemploAdd() {
    console.log("--- CalcAUD.add(): Adição de Valores ---");

    // Exemplo 1: Adição Simples
    const valorInicial = CalcAUD.from(100);
    const resultadoSimples = valorInicial.add(25);
    console.log(`1. 100 + 25 = ${resultadoSimples.commit(0).toString()}`); // Saída: 125

    // Exemplo 2: Adição com Decimais
    const valorDecimal = CalcAUD.from("10.50");
    const resultadoDecimal = valorDecimal.add("0.25");
    console.log(`2. 10.50 + 0.25 = ${resultadoDecimal.commit(2).toString()}`); // Saída: 10.75

    // Exemplo 3: Adição Encadeada (Imutabilidade)
    const inicioCadeia = CalcAUD.from(10);
    const passo1 = inicioCadeia.add(5); // 15
    const passo2 = passo1.add(2); // 17

    console.log(`3. 10 + 5 + 2 = ${passo2.commit(0).toString()}`); // Saída: 17
    console.log(`   Valor inicial (inalterado): ${inicioCadeia.commit(0).toString()}`); // Saída: 10

    // Exemplo 4: Adição com valores negativos (efetivamente uma subtração)
    const comNegativo = CalcAUD.from(50).add(-10);
    console.log(`4. 50 + (-10) = ${comNegativo.commit(0).toString()}`); // Saída: 40
    console.log(`   Auditoria LaTeX: ${comNegativo.commit(0).toLaTeX()}`); // Saída: $$ 50 - 10 = 40 $$

    // Exemplo 5: Adição de uma instância CalcAUD
    const valorBase = CalcAUD.from(200);
    const valorExtra = CalcAUD.from(15).mult(2); // 30
    const comInstancia = valorBase.add(valorExtra);
    console.log(`5. 200 + (15 * 2) = ${comInstancia.commit(0).toString()}`); // Saída: 230
    console.log(`   Auditoria Verbal: ${comInstancia.commit(0).toVerbalA11y()}`); // Saída: ... 200 mais em grupo, 15 multiplicado por 2, fim do grupo é igual a 230 ...
}

exemploAdd();
