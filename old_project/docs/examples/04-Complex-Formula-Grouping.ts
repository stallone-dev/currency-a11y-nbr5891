/**
 * @title Exemplo 04: Estruturação de Fórmulas Complexas
 * @description Uso de agrupamento (.group) para controlar precedência matemática e visualização LaTeX.
 * @tags complex, grouping, precedence
 */

import { CalcAUD } from "../../src/main.ts";

// Objetivo: Calcular o Custo Médio Ponderado de Capital (WACC) simplificado.
// Fórmula: (E / V) * Re + (D / V) * Rd * (1 - T)
// Onde:
// E = Valor do Equity (1000)
// D = Valor da Dívida (500)
// V = E + D (1500)
// Re = Custo do Equity (0.10)
// Rd = Custo da Dívida (0.05)
// T = Imposto (0.30)

function calcularWACC() {
    console.log("--- Cálculo WACC (Precedência e Agrupamento) ---");

    const E = CalcAUD.from(1000);
    const D = CalcAUD.from(500);
    const Re = CalcAUD.from("0.10");
    const Rd = CalcAUD.from("0.05");
    const T = CalcAUD.from("0.30");

    // 1. Calculamos V (Valor Total)
    // Usamos .group() aqui para que no LaTeX apareça como um termo único se usado em divisão
    const V = E.add(D).group(); // (1000 + 500)

    // 2. Parte 1: (E / V) * Re
    const part1 = E.div(V).mult(Re);
    // LaTeX gerado autómatico: 1000 / (1000 + 500) * 0.10

    // 3. Parte 2: (D / V) * Rd * (1 - T)
    // Primeiro calculamos o benefício fiscal (1 - T)
    const beneficioFiscal = CalcAUD.from(1).sub(T).group(); // (1 - 0.30)

    const part2 = D.div(V).mult(Rd).mult(beneficioFiscal);

    // 4. WACC Final
    const WACC = part1.add(part2);

    const output = WACC.commit(4);

    console.log("Fórmula Auditável (LaTeX):");
    console.log(output.toLaTeX());

    // O .group() garante que os denominadores e subtrações sejam visualizados corretamente
    // sem ambiguidades de precedência.

    console.log("\nResultado WACC:");
    console.log(output.toString()); // ~0.0783 (7.83%)
}

calcularWACC();
