import type { CalcAUYCustomOutput } from "@st-all-one/calc-auy";
import { KATEX_CSS_MINIFIED } from "./vendor.ts";
import katex from "katex";

/**
 * Processador oficial para renderização de fórmulas matemáticas em HTML.
 *
 * **Engenharia:** Injeta o motor KaTeX e o CSS minificado (com fontes)
 * diretamente no rastro, gerando um fragmento auto-contido e acessível.
 */
export const htmlProcessor: CalcAUYCustomOutput<string> = function (
    ctx,
): string {
    const { audit } = ctx;

    // Recupera o LaTeX já calculado pelo core
    const fullLatex = audit.latex;

    // Renderização visual via KaTeX
    const rendered = katex.renderToString(fullLatex, {
        displayMode: true,
        throwOnError: false,
    });

    // Recupera a tradução verbal para acessibilidade (ARIA)
    const verbal = audit.verbal;

    const result = `
<div class="calc-auy-result" aria-label="${verbal}">
  <style>
    ${KATEX_CSS_MINIFIED}
    .calc-auy-result { margin: 1em 0; overflow-x: auto; }
  </style>
  ${rendered}
</div>`.trim();

    return result;
};
