// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import katex from "@katex";
import { KATEX_CSS_MINIFIED } from "../constants.ts";

// Cache estático para o CSS do KaTeX
let cachedKaTeXCSS: string | null = null;

/**
 * Gera o HTML para exibição da fórmula matemática utilizando o motor KaTeX.
 *
 * O HTML gerado inclui tanto o suporte visual (MathML/SVG via KaTeX) quanto
 * suporte de acessibilidade via 'aria-label', permitindo que leitores de
 * tela narrem o cálculo corretamente.
 *
 * @param latexExpression A expressão LaTeX acumulada.
 * @param result O resultado final formatado.
 * @param verbalDescription A descrição verbalizada para acessibilidade.
 * @returns String contendo HTML e CSS inline.
 */
export function generateHTML(latexExpression: string, result: string, verbalDescription: string): string {
    // Injetamos o CSS do KaTeX apenas uma vez (cache estático) para otimizar o payload HTML.
    if (!cachedKaTeXCSS) {
        cachedKaTeXCSS = KATEX_CSS_MINIFIED;
    }

    const fullLatex = `${latexExpression} = ${result}`;
    const renderedHTML = katex.renderToString(fullLatex, {
        displayMode: true,
        throwOnError: false,
    });

    return `
<div class="auditable-amount-container" aria-label="${verbalDescription}">
  <style>
    ${cachedKaTeXCSS}
    .auditable-amount-container { margin: 1em 0; overflow-x: auto; }
  </style>
  ${renderedHTML}
</div>`.trim();
}
