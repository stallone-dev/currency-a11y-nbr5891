// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { CalcAUYOutput } from "@calc-auy";
import katex from "@katex";

/**
 * Mapeia todos os formatos de saída de uma instância CalcAUYOutput para um
 * objeto serializável, incluindo conversões binárias para visualização na web.
 *
 * @param output A instância de saída a ser mapeada.
 * @returns Objeto contendo todas as representações do cálculo.
 */
export function mapAllOutputs(
    output: CalcAUYOutput,
): Record<string, string | number | null> {
    // Passa a instância do KaTeX para métodos que exigem renderização visual
    const buffer = output.toImageBuffer(katex);
    const hex = Array.from(buffer).map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");
    const base64 = btoa(String.fromCharCode(...buffer));

    // Exemplo de processador customizado para o toCustomOutput (Contexto atualizado)
    const customReport = output.toCustomOutput((ctx) => {
        return `[AUDIT-REPORT] Value: ${ctx.result.n}/${ctx.result.d} | LaTeX: ${ctx.audit.latex} | Strategy: ${ctx.strategy}`;
    });

    return {
        toString: output.toStringNumber(),
        toFloatNumber: output.toFloatNumber(),
        toRawInternalBigInt: output.toRawInternalBigInt().toString(),
        toMonetary: output.toMonetary(),
        toLaTeX: output.toLaTeX(),
        toHTML: output.toHTML(katex),
        toVerbalA11y: output.toVerbalA11y(),
        toUnicode: output.toUnicode(),
        toJson: output.toJSON(),
        toCustomOutput: customReport,
        toImageBufferHex: hex,
        toImageDataBase64: `data:image/svg+xml;base64,${base64}`,
    };
}
