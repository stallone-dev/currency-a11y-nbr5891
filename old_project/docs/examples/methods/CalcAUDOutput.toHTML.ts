/**
 * @title Método: CalcAUDOutput.toHTML()
 * @description Exemplos de como gerar HTML com fórmulas matemáticas renderizadas via KaTeX.
 * @tags toHTML, output, visualization, katex
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToHTML() {
    console.log("--- CalcAUDOutput.toHTML(): HTML Renderizado (KaTeX) ---");

    // Exemplo 1: Fórmula Financeira Básica
    // C = P(1 + i)^n
    const principal = CalcAUD.from(1000);
    const taxa = CalcAUD.from("0.05");
    const tempo = 2; // Anos
    const montante = principal.mult(CalcAUD.from(1).add(taxa).pow(tempo));

    const outputMontante = montante.commit(2);
    console.log(`1. Montante de juros compostos:`);
    console.log(outputMontante.toHTML());
    // Saída: HTML com a fórmula renderizada para 1000 	imes (1 + 0.05)^2 = 1102.50

    // Exemplo 2: Fórmula com Fração e Agrupamento
    const calcFracao = CalcAUD.from(100).div(CalcAUD.from(5).add(5).group());
    const outputFracao = calcFracao.commit(0);
    console.log(`
2. Divisão com agrupamento:`);
    console.log(outputFracao.toHTML());
    // Saída: HTML com a fórmula renderizada para 100 / (5 + 5) = 10

    // Exemplo 3: Fórmula mais complexa com raízes
    const calcRaizComplexa = CalcAUD.from(8).pow("1/3").mult(CalcAUD.from(4).pow(2));
    const outputRaiz = calcRaizComplexa.commit(0);
    console.log(`
3. Raiz e potência combinadas:`);
    console.log(outputRaiz.toHTML());
    // Saída: HTML para \sqrt[3]{8} 	imes 4^2 = 48

    // Exemplo 4: HTML com acessibilidade (aria-label)
    const outputAcessivel = CalcAUD.from(10).add(5).commit(0);
    const htmlAcessivel = outputAcessivel.toHTML();
    console.log(`
4. HTML com aria-label para acessibilidade (fragmento):`);
    console.log(htmlAcessivel.substring(0, 100) + "..."); // Mostra o início do HTML com aria-label
    // Em um navegador, o leitor de tela leria a descrição verbal gerada.
}

exemploToHTML();
