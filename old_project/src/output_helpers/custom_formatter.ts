// Create by Stallone L. S. (@st-all-one) - 2026 - License: MPL-2.0
/*
 * Copyright (c) 2026, Stallone L. S. (@st-all-one)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { CalcAUDOutput } from "../output.ts";
import type { CalcAUDOutputOptions } from "./options.ts";

/**
 * Interface funcional para criação de processadores de saída customizados.
 *
 * Permite que desenvolvedores estendam a biblioteca CalcAUD para suportar
 * formatos de exportação proprietários ou protocolos específicos.
 *
 * @template Toutput O tipo de retorno definido pelo desenvolvedor.
 *
 * @example
 * ```ts
 * // Exemplo: Exportador de Log Simples
 * const logProcessor: ICalcAUDCustomOutput<void> = (ctx) => {
 *   console.log(`Valor Bruto: ${ctx.rawData.value}`);
 * };
 * res.toCustomOutput(logProcessor);
 * ```
 */
export type ICalcAUDCustomOutput<Toutput> = (this: CalcAUDOutput, context: ICalcAUDCustomOutputContext) => Toutput;

/**
 * Contexto de dados e métodos fornecido aos processadores customizados.
 *
 * Contém tanto os dados brutos (BigInt, LaTeX) quanto acesso aos métodos
 * de formatação padrão para reutilização.
 */
export interface ICalcAUDCustomOutputContext {
    /** Dados puros do cálculo para processamento direto. */
    rawData: {
        readonly value: bigint;
        readonly decimalPrecision: number;
        readonly latexExpression: string;
        readonly verbalExpression: string;
        readonly unicodeExpression: string;
        readonly options: Readonly<Required<CalcAUDOutputOptions>>;
    };
    /** Acesso aos métodos de saída padrão da biblioteca. */
    method: Pick<
        CalcAUDOutput,
        | "toString"
        | "toFloatNumber"
        | "toCentsInBigInt"
        | "toRawInternalBigInt"
        | "toMonetary"
        | "toLaTeX"
        | "toHTML"
        | "toVerbalA11y"
        | "toUnicode"
        | "toImageBuffer"
    >;
}
