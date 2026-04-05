// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { CalcAUDOutput } from "@calc-aud-nbr-a11y";

/**
 * Mapeia todos os formatos de saída de uma instância CalcAUDOutput para um
 * objeto serializável, incluindo conversões binárias para visualização na web.
 *
 * @param output A instância de saída a ser mapeada.
 * @returns Objeto contendo todas as representações do cálculo.
 */
export function mapAllOutputs(
    output: CalcAUDOutput,
): Record<string, string | number | null> {
    const buffer = output.toImageBuffer();
    const hex = Array.from(buffer).map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");
    const base64 = btoa(String.fromCharCode(...buffer));

    // Exemplo de processador customizado para o toCustomOutput
    const customReport = output.toCustomOutput((ctx) => {
        return `[AUDIT-REPORT] Value: ${ctx.rawData.value} | Formula: ${ctx.rawData.unicodeExpression} | Decimals: ${ctx.rawData.decimalPrecision}`;
    });

    return {
        toString: output.toString(),
        toFloatNumber: output.toFloatNumber(),
        toRawInternalBigInt: output.toRawInternalBigInt().toString(),
        toMonetary: output.toMonetary(),
        toLaTeX: output.toLaTeX(),
        toHTML: output.toHTML(),
        toVerbalA11y: output.toVerbalA11y(),
        toUnicode: output.toUnicode(),
        toJson: output.toJson(),
        toCustomOutput: customReport,
        toImageBufferHex: hex,
        toImageDataBase64: `data:image/svg+xml;base64,${base64}`,
    };
}
