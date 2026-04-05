/**
 * @title Método: CalcAUDOutput.toUnicode()
 * @description Exemplos de como gerar a representação Unicode de um cálculo para logs ou terminais.
 * @tags toUnicode, output, console, text
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToUnicode() {
    console.log("--- CalcAUDOutput.toUnicode(): Expressões Unicode ---");

    // Exemplo 1: Operações Aritméticas Básicas
    const calcBasico = CalcAUD.from(100).add(50).mult(2);
    const outputBasico = calcBasico.commit(0);
    console.log(`1. Básico: ${outputBasico.toUnicode()}`);
    // Saída: 100 + 50 × 2 = roundₙʙᵣ(200, 0) = 200

    // Exemplo 2: Divisão com dízima (mantém precisão visual)
    const calcDiv = CalcAUD.from(10).div(3);
    const outputDiv = calcDiv.commit(2);
    console.log(`2. Divisão: ${outputDiv.toUnicode()}`);
    // Saída: 10 ÷ 3 = roundₙʙᵣ(3.333333, 2) = 3.33

    // Exemplo 3: Potência e Raiz (com sobrescritos e símbolos especiais)
    const calcPowRaiz = CalcAUD.from(81).pow("1/2").add(CalcAUD.from(2).pow(3));
    const outputPowRaiz = calcPowRaiz.commit(0);
    console.log(`3. Potência e Raiz: ${outputPowRaiz.toUnicode()}`);
    // Saída: ²√(81) + 2³ = roundₙʙᵣ(17, 0) = 17

    // Exemplo 4: Agrupamento
    const calcGroup = CalcAUD.from(10).add(5).group().mult(2);
    const outputGroup = calcGroup.commit(0);
    console.log(`4. Agrupamento: ${outputGroup.toUnicode()}`);
    // Saída: (10 + 5) × 2 = roundₙʙᵣ(30, 0) = 30

    // Exemplo 5: Divisão Inteira e Módulo (Euclidiana)
    const calcDivIntMod = CalcAUD.from(-10).divInt(3).add(CalcAUD.from(-10).mod(3));
    const outputDivIntMod = calcDivIntMod.commit(0);
    console.log(`5. DivInt e Mod: ${outputDivIntMod.toUnicode()}`);
    // Saída: ⌊-10 ÷ 3⌋ + -10 mod 3 = roundₙʙᵣ(-2, 0) = -2 (Valor interno -4 + 2 = -2)
}

exemploToUnicode();
