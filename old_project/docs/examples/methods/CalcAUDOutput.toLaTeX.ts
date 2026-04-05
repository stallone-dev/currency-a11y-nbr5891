/**
 * @title Método: CalcAUDOutput.toLaTeX()
 * @description Exemplos de como gerar a representação LaTeX completa de um cálculo para documentação.
 * @tags toLaTeX, output, audit, documentation
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToLaTeX() {
    console.log("--- CalcAUDOutput.toLaTeX(): Expressões LaTeX ---");

    // Exemplo 1: Soma e Subtração Simples
    const calcSimples = CalcAUD.from(100).add(50).sub(25);
    const outputSimples = calcSimples.commit(0);
    console.log(`1. Expressão simples: ${outputSimples.toLaTeX()}`);
    // Saída: $$ 100 + 50 - 25 = 	ext{round}_{NBR}(125, 0) = 125 $$

    // Exemplo 2: Multiplicação e Divisão (com dízima)
    const calcComplexo = CalcAUD.from(10).mult(3).div(7);
    const outputComplexo = calcComplexo.commit(4);
    console.log(`2. Expressão complexa: ${outputComplexo.toLaTeX()}`);
    // Saída: $$ 10 	imes 3 \div 7 = 	ext{round}_{NBR}(4.285714285714, 4) = 4.2857 $$

    // Exemplo 3: Potência e Raiz
    const calcPow = CalcAUD.from(81).pow("1/2"); // Raiz quadrada
    const outputPow = calcPow.commit(0);
    console.log(`3. Potência/Raiz: ${outputPow.toLaTeX()}`);
    // Saída: $$ \sqrt[2]{81} = 	ext{round}_{NBR}(9, 0) = 9 $$

    // Exemplo 4: Agrupamento
    const calcGroup = CalcAUD.from(10).add(5).group().mult(2);
    const outputGroup = calcGroup.commit(0);
    console.log(`4. Com agrupamento: ${outputGroup.toLaTeX()}`);
    // Saída: $$ \left( 10 + 5  right) 	imes 2 = 	ext{round}_{NBR}(30, 0) = 30 $$

    // Exemplo 5: Divisão Inteira (Euclidiana) e Módulo
    const calcDivMod = CalcAUD.from(10).divInt(3).add(CalcAUD.from(10).mod(3));
    const outputDivMod = calcDivMod.commit(0);
    console.log(`5. Divisão Inteira e Módulo: ${outputDivMod.toLaTeX()}`);
    // Saída: $$ \lfloor \frac{10}{3} floor + 10 \bmod 3 = 	ext{round}_{NBR}(4, 0) = 4 $$
}

exemploToLaTeX();
