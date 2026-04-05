/**
 * @title Método: CalcAUDOutput.toImageBuffer()
 * @description Exemplos de como gerar um buffer de imagem SVG de um cálculo para visualização em dashboards ou PDFs.
 * @tags toImageBuffer, output, visualization, svg
 */

import { CalcAUD } from "../../src/main.ts";

function exemploToImageBuffer() {
    console.log("--- CalcAUDOutput.toImageBuffer(): Imagem SVG ---");

    // Exemplo 1: Fórmula simples
    const calcSimples = CalcAUD.from(100).div(3);
    const outputSimples = calcSimples.commit(2);
    const bufferSimples = outputSimples.toImageBuffer();
    console.log(`1. Buffer SVG para "100 / 3" (tamanho: ${bufferSimples.length} bytes)`);
    // Em um ambiente real, você salvaria este buffer em um arquivo .svg
    // console.log(new TextDecoder().decode(bufferSimples)); // Descomente para ver o XML SVG

    // Exemplo 2: Fórmula complexa com raízes e potências
    const calcComplexo = CalcAUD.from(1000).mult(CalcAUD.from(1).add("0.07").pow("1/12"));
    const outputComplexo = calcComplexo.commit(4);
    const bufferComplexo = outputComplexo.toImageBuffer();
    console.log(`2. Buffer SVG para (1000 * (1.07)^(1/12)) (tamanho: ${bufferComplexo.length} bytes)`);

    // Exemplo 3: Imagem com descrição verbal para acessibilidade
    // A descrição verbal é utilizada como aria-label no SVG gerado
    const calcA11y = CalcAUD.from(50).add(25);
    const outputA11y = calcA11y.commit(0, { locale: "es-ES" });
    const bufferA11y = outputA11y.toImageBuffer();
    console.log(`3. Buffer SVG com aria-label em espanhol (tamanho: ${bufferA11y.length} bytes)`);
    // O leitor de tela usaria a string gerada por toVerbalA11y() no SVG
    const svgXml = new TextDecoder().decode(bufferA11y);
    const ariaLabel = svgXml.match(/aria-label="([^"]*)"/)?.[1];
    console.log(`   aria-label no SVG: "${ariaLabel}"`);
}

exemploToImageBuffer();
