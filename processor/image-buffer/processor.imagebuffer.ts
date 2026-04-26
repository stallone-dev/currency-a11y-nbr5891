import type {
    CalcAUYCustomOutput,
    CalcAUYCustomOutputContext,
} from "@st-all-one/calc-auy";
import { htmlProcessor } from "../html/processor.html.ts";
import { generateSVG } from "./image_utils.ts";

const encoder = new TextEncoder();

/**
 * Processador oficial para geração de buffers de imagem (SVG) da fórmula.
 */
export const imageBufferProcessor: CalcAUYCustomOutput<Uint8Array> = function (
    ctx: CalcAUYCustomOutputContext,
): Uint8Array {
    const { audit } = ctx;

    // Reutiliza o renderizador HTML para obter o conteúdo visual do SVG
    // Passamos o contexto manualmente
    const html = htmlProcessor.call(this, ctx);

    // O htmlProcessor já inclui style e aria-label, o que é ótimo para o SVG
    const svg = generateSVG(html, audit.latex);

    return encoder.encode(svg);
};
