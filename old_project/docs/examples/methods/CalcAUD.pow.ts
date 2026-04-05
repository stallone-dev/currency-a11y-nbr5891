/**
 * @title Método: CalcAUD.pow()
 * @description Exemplos de exponenciação (potência) e radiciação (raízes) usando expoentes de diferentes formatos.
 * @tags pow, math, exponents, roots
 */

import { CalcAUD } from "../../src/main.ts";

function exemploPow() {
    console.log("--- CalcAUD.pow(): Potenciação e Radiciação ---");

    // Exemplo 1: Potência Inteira Simples
    // 2^3 = 8
    const powInteira = CalcAUD.from(2).pow(3);
    console.log(`1. 2^3 = ${powInteira.commit(0).toString()}`); // Saída: 8

    // Exemplo 2: Raiz Quadrada (expoente decimal)
    // 9^(0.5) = 3
    const raizDecimal = CalcAUD.from(9).pow(0.5);
    console.log(`2. 9^(0.5) = ${raizDecimal.commit(0).toString()}`); // Saída: 3

    // Exemplo 3: Raiz Cúbica (expoente fracionário)
    // 27^(1/3) = 3
    const raizFracionaria = CalcAUD.from(27).pow("1/3");
    console.log(`3. 27^(1/3) = ${raizFracionaria.commit(0).toString()}`); // Saída: 3
    console.log(`   Auditoria LaTeX: ${raizFracionaria.commit(0).toLaTeX()}`); // Saída: $$ \sqrt[3]{27} = 3 $$

    // Exemplo 4: Potência com valores decimais (juros compostos)
    // 100 * (1 + 0.05)^2 = 110.25
    const jurosCompostos = CalcAUD.from(100).mult(CalcAUD.from(1).add("0.05").pow(2));
    console.log(`4. 100 * (1.05)^2 = ${jurosCompostos.commit(2).toString()}`); // Saída: 110.25

    // Exemplo 5: Potência de uma fração (com alta precisão)
    // (1/7)^3 = 1 / 343 = 0.002915...
    const fracaoElevada = CalcAUD.from("1/7").pow(3);
    console.log(`5. (1/7)^3 (6 casas) = ${fracaoElevada.commit(6).toString()}`); // Saída: 0.002915
    console.log(`   Auditoria Verbal: ${fracaoElevada.commit(6).toVerbalA11y()}`);

    // Exemplo 6: Tratamento de expoentes inválidos
    try {
        CalcAUD.from(10).pow("1/2/3");
    } catch (e: any) {
        console.log(`6. Erro esperado para expoente "1/2/3": ${e.title}`); // Saída: Expoente Fracionário Inválido
    }

    try {
        CalcAUD.from(10).pow("abc");
    } catch (e: any) {
        console.log(`7. Erro esperado para expoente "abc": ${e.title}`); // Saída: Valor de Expoente Inválido
    }
}

exemploPow();
