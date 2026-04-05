// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { generateHTML } from "./html_generator.ts";

/**
 * Gera um buffer de imagem (representação binária SVG) para o resultado do cálculo.
 *
 * Esta função utiliza uma abordagem de engenharia heurística para calcular
 * as dimensões ideais do ViewBox, garantindo que o conteúdo LaTeX renderizado
 * não seja cortado e mantenha uma estética profissional.
 *
 * @param latexExpression A expressão LaTeX acumulada.
 * @param result O resultado final formatado.
 * @param verbalDescription A descrição verbalizada para metadados de acessibilidade.
 * @returns Um Uint8Array contendo os bytes da imagem SVG (codificação UTF-8).
 */
export function generateImageBuffer(latexExpression: string, result: string, verbalDescription: string): Uint8Array {
    // 1. Gera o HTML base que serve como fonte para o foreignObject do SVG
    const htmlContent = generateHTML(latexExpression, result, verbalDescription);

    // --- ENGENHARIA DO CÁLCULO HEURÍSTICO DO VIEWBOX ---
    // Como o SVG foreignObject não ajusta o tamanho automaticamente ao conteúdo HTML interno,
    // precisamos estimar a largura e altura baseando-nos na complexidade da expressão.

    const scaleFactor = 1.3;
    const averagePxPerChar = 8;
    const paddingHorizontal = 16;
    const paddingVertical = 16;

    // Medimos o comprimento textual da expressão para estimar a largura horizontal.
    const textToMeasure = `${latexExpression} = ${result}`;
    const textLength = textToMeasure.length;

    const estimatedWidth = (textLength * averagePxPerChar * scaleFactor) + (paddingHorizontal * 2);

    // Aplicamos limites de segurança (Clamping) para evitar arquivos corrompidos ou ilegíveis.
    const minWidth = 300;
    const maxWidth = 2000;
    const finalWidth = Math.max(minWidth, Math.min(maxWidth, Math.ceil(estimatedWidth)));

    let verticalExpansion = 0;

    // Detecção de elementos LaTeX que aumentam a altura da linha (frações e raízes).
    const fracMatches = latexExpression.match(/\\frac/g);
    if (fracMatches) {
        verticalExpansion += fracMatches.length * 15;
    }

    const sqrtMatches = latexExpression.match(/\\sqrt/g);
    if (sqrtMatches) {
        verticalExpansion += sqrtMatches.length * 25;
    }

    const baseHeight = (24 * scaleFactor) + (paddingVertical * 2) + verticalExpansion;
    const minHeight = 80;
    const maxHeight = 1000;
    const finalHeight = Math.max(minHeight, Math.min(maxHeight, Math.ceil(baseHeight)));

    // Construímos o XML do SVG encapsulando o HTML renderizado pelo KaTeX.
    const svgString = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${finalWidth} ${finalHeight}"
  width="${finalWidth}"
  height="${finalHeight}"
  preserveAspectRatio="xMidYMid meet"
  style="background: white; border-radius: 8px; border: 1px solid #eee;"
>
  <foreignObject width="100%" height="100%">
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: ${paddingVertical}px ${paddingHorizontal}px;
        margin: 0;
        font-family: sans-serif;
      "
    >
      <div style="font-size: ${scaleFactor}em; margin: 0; color: #333;">
        ${htmlContent}
      </div>
    </div>
  </foreignObject>
</svg>`.trim();

    return new TextEncoder().encode(svgString);
}
